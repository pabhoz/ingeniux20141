// Daniel Shiffman
// Kinect Point Cloud example
// http://www.shiffman.net
// https://github.com/shiffman/libfreenect/tree/master/wrappers/java/processing

import org.openkinect.*;
import org.openkinect.processing.*;

PrintWriter output;
boolean guardar= false; 

// Kinect Library object
Kinect kinect;

float a = 0.0;

int skip = 5;


// Size of kinect image
int w = 640;
int h = 480;

boolean der=false, izq=false;

// We'll use a lookup table so that we don't have to repeat the math over and over
float[] depthLookUp = new float[2048];

void setup() {
  size(800, 600, P3D);
  kinect = new Kinect(this);
  kinect.start();
  kinect.enableDepth(true);
  // We don't need the grayscale image in this example
  // so this makes it more efficient
  kinect.processDepthImage(false);

  //arr = new 
  // Lookup table for all possible depth values (0 - 2047)
  for (int i = 0; i < depthLookUp.length; i++) {
    depthLookUp[i] = rawDepthToMeters(i);
  }

  output = createWriter("alturas.txt");
}

void draw() {

  background(0);
  fill(255);

  // Get the raw depth as array of integers
  int[] depth = kinect.getRawDepth();

  // We're just going to calculate and draw every 4th pixel (equivalent of 160x120)
  //int skip = 20;

  // Translate and rotate
  translate(width/2, height/2, -10);
  rotateY(a);
  if (guardar)
  {
    output.print(w + "," + h + "," +skip);
  }

  for (int x=0; x<w; x+=skip) {
    for (int y=0; y<h; y+=skip) {
      int offset = x+y*w;

      // Convert kinect data to world xyz coordinate
      int rawDepth = depth[offset];
      PVector v = depthToWorld(x, y, rawDepth);
      
            float factor = 500;

      // generador de txt con los puntos separados por comas

      if (guardar)
      {
        output.print(",");
        output.print(v.z);

      }

      stroke(255);
      pushMatrix();
      // Scale up by 200
      translate(v.x*factor, v.y*factor, factor-v.z*factor);
      // Draw a point

      colorMode(HSB, factor);
      fill(factor - (v.z * factor), factor, factor);
      stroke(factor - (v.z * factor), factor, factor);
      //rect(0, 0, skip/2, skip/2);
      point(0, 0);
      popMatrix();
    }
  }
  
  if (guardar)
      {
        output.flush();
        output.close();  // Finishes the file
        stop();
        exit();
      }
  
  guardar = false;

  // Rotate
  if (der) {
    a += 0.015f;
  } 
  else if (izq) {
    a -= 0.015f;
  }
}

// These functions come from: http://graphics.stanford.edu/~mdfisher/Kinect.html
float rawDepthToMeters(int depthValue) {
  if (depthValue < 2047) {
    return (float)(1.0 / ((double)(depthValue) * -0.0030711016 + 3.3309495161));
  }
  return 0.0f;
}

PVector depthToWorld(int x, int y, int depthValue) {

  final double fx_d = 1.0 / 5.9421434211923247e+02;
  final double fy_d = 1.0 / 5.9104053696870778e+02;
  final double cx_d = 3.3930780975300314e+02;
  final double cy_d = 2.4273913761751615e+02;

  PVector result = new PVector();
  double depth =  depthLookUp[depthValue];//rawDepthToMeters(depthValue);
  result.x = (float)((x - cx_d) * depth * fx_d);
  result.y = (float)((y - cy_d) * depth * fy_d);
  result.z = (float)(depth);
  return result;
}

void stop() {
  kinect.quit();
  super.stop();
}

void keyPressed() {
  switch (key) {
  case 'a':
    izq = true;
    break;
  case 'd':
    der = true;  
    break;
  case 'r':
    a = 0.0f;
    break;
  }
}
void keyReleased() {
  switch (key) {
  case 'a':
    izq = false;
    break;
  case 'd':
    der = false;  
    break;
  case 'w':
    guardar = true;
    break;
  }
}

