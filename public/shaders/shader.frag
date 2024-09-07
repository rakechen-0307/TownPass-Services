#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D tex0;   // Main image texture
uniform sampler2D mask;   // Mask texture
varying vec2 vTexCoord;

vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec4 tint(vec4 ori, vec4 mask) {
  vec3 ori_hsv  = rgb2hsv(ori.xyz);
  vec3 mask_hsv = rgb2hsv(mask.xyz);
  ori_hsv.x = mask_hsv.x;
  ori_hsv.y = mix(ori_hsv.y, mask_hsv.y, 0.5);
  return vec4(hsv2rgb(ori_hsv), 1.0);

  // return mix(ori, mask, 0.5);
}

void main() {

  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;
  vec4 imgColor = texture2D(tex0, uv);    // Get color from the image
  vec4 maskColor = texture2D(mask, uv);   // Get color from the mask

  // gl_FragColor = vec4(maskColor.a, 0.0, 0.0, 1.0);
  // Check if the alpha of the mask is not 1.0
  if (maskColor.a == 1.0) {
    gl_FragColor = maskColor;    // Make that part black
  } else if (maskColor.a >= 0.1)  {
    gl_FragColor = tint(imgColor, maskColor);
  } else {
    gl_FragColor = imgColor;
  }
}
