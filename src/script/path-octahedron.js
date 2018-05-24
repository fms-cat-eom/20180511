import MathCat from './libs/mathcat';
const octahedron = require( './octahedron' );
const glslify = require( 'glslify' );

// ------

module.exports = ( glCatPath, width, height ) => {
  let glCat = glCatPath.glCat;
  let gl = glCat.gl;

  // ------

  let oct = octahedron( 1 );
  let vboOctPos = glCat.createVertexbuffer( oct.pos );
  let vboOctNor = glCat.createVertexbuffer( oct.nor );

  let vboQuad = glCat.createVertexbuffer( [ -1, -1, 1, -1, -1, 1, 1, 1 ] );

  // ------

  glCatPath.add( {
    octahedron: {
      width: width,
      height: height,
      vert: glslify( './shader/object.vert' ),
      frag: glslify( './shader/shade.frag' ),
      blend: [ gl.ONE, gl.ZERO ],
      clear: [ 0.0, 0.0, 0.0, 0.0 ],
      framebuffer: true,
      float: true,
      func: ( path, params ) => {
        glCat.attribute( 'pos', vboOctPos, 3 );
        glCat.attribute( 'nor', vboOctNor, 3 );
        glCat.uniform3fv( 'color', [ 1.0, 1.0, 1.0 ] );

        let matM = MathCat.mat4Identity();
        matM = MathCat.mat4Apply( MathCat.mat4RotateX( params.progress * Math.PI ), matM );
        matM = MathCat.mat4Apply( MathCat.mat4RotateZ( params.progress * Math.PI * 2.0 ), matM );
        glCat.uniformMatrix4fv( 'matM', matM );

        gl.drawArrays( gl.TRIANGLES, 0, vboOctPos.length / 3 );
      }
    },
  } );
};