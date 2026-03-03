import { shaderMaterial } from "@react-three/drei";
import { extend, type ThreeElement } from "@react-three/fiber";
import { Color, FrontSide, AdditiveBlending, type Side } from "three";
import type { ColorRepresentation } from "three";

/** Props for the material */
type Props = {
    falloff?: number;
    glowInternalRadius?: number;
    glowColor?: ColorRepresentation;
    glowSharpness?: number;
    side?: Side;
};

/** Create the material class once */
const FakeGlowMat = shaderMaterial(
    {
        falloffAmount: 0.1,
        glowInternalRadius: 6,
        glowColor: new Color("#00ff00"),
        glowSharpness: 1,
    },
    /* vertex shader */ `
    varying vec3 vPosition;
    varying vec3 vNormal;
    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * viewMatrix * modelPosition;
      vec4 modelNormal = modelMatrix * vec4(normal, 0.0);
      vPosition = modelPosition.xyz;
      vNormal = modelNormal.xyz;
    }
  `,
    /* fragment shader */ `
    uniform vec3 glowColor;
    uniform float falloffAmount;
    uniform float glowSharpness;
    uniform float glowInternalRadius;

    varying vec3 vPosition;
    varying vec3 vNormal;

    void main() {
      vec3 normal = normalize(vNormal);
      if (!gl_FrontFacing) normal *= -1.0;
      vec3 viewDirection = normalize(cameraPosition - vPosition);
      float fresnel = dot(viewDirection, normal);
      fresnel = pow(fresnel, glowInternalRadius + 0.1);
      float falloff = smoothstep(0., falloffAmount, fresnel);
      float fakeGlow = fresnel;
      fakeGlow += fresnel * glowSharpness;
      fakeGlow *= falloff;
      gl_FragColor = vec4(clamp(glowColor * fresnel, 0., 1.0), clamp(fakeGlow, 0., 1.0));
    }
  `
);

/** Register once */
extend({ FakeGlowMat });

/** Type augmentation */
declare module "@react-three/fiber" {
    interface ThreeElements {
        fakeGlowMat: ThreeElement<typeof FakeGlowMat>;
    }
}

/** Component to wrap it in JSX */
export const FakeGlowMaterial = ({
                                     falloff = 0.1,
                                     glowInternalRadius = 6,
                                     glowColor = "#00ff00",
                                     glowSharpness = 1,
                                     side = FrontSide,
                                 }: Props) => {
    return (
        <fakeGlowMat
            side={side}
            transparent
            blending={AdditiveBlending}
            depthTest={false}
            // Pass uniforms
            glowColor={new Color(glowColor)}
            falloffAmount={falloff}
            glowInternalRadius={glowInternalRadius}
            glowSharpness={glowSharpness}
        />
    );
};