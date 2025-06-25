const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ]
};

let manager;

let text = 'A';
let fontSize = 1200;
let fontFamily = 'serif';

const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');

const sketch = ({ context, width, height }) => {
  const cell = 20;
  const cols = Math.floor(width / cell);
  const rows = Math.floor(height / cell);
  const numCells = cols * rows;

  typeCanvas.width = cols;
  typeCanvas.height = rows;

  return ({ context, width, height }) => {
    typeContext.fillStyle = 'black';
    typeContext.fillRect(0, 0, cols, rows);

    fontSize = cols*1.2;

    typeContext.fillStyle = 'white';
    typeContext.font = `${fontSize}px "${fontFamily}"`;
    typeContext.textBaseline = 'top';
    // context.textAlign = 'center';

    const metrics = typeContext.measureText(text);
    const mx = metrics.actualBoundingBoxLeft * -1;
    const my = metrics.actualBoundingBoxAscent * -1;
    const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    const mh = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    const x= cols / 2 - mw / 2 - mx;
    const y= rows / 2 - mh / 2 - my;


    typeContext.save();
    typeContext.translate(x, y);

    typeContext.beginPath();
    typeContext.rect(mx, my, mw, mh);
    typeContext.stroke();

    typeContext.fillText(text, 0, 0);
    typeContext.restore();

    const typeData = typeContext.getImageData(0, 0, cols, rows).data;
    console.log(typeData);

    context.drawImage(typeCanvas, 0, 0);

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.basreLine = 'middle';
    context.textAlign = 'center';

    context.drawImage(typeCanvas, 0, 0);

    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cell;
      const y = row * cell;

      const index = (col + row * cols) * 4;

      const r = typeData[index + 0];
      const g = typeData[index + 1];
      const b = typeData[index + 2];
      const a = typeData[index + 3];

      const glyph = getGlyph(r);

      context.font = `${cell * 2}px "${fontFamily}"`;
      if (Math.random() < 0.1) context.font = `${cell * 4}px "${fontFamily}"`;

      context.fillStyle = `white`;

      context.save();
      context.translate(x + cell / 2, y + cell / 2);

      context.fillText(glyph, 0, 0);

      context.restore();
    }
  };
};

const getGlyph = (v) => {
  if (v < 50) return ' ';
  if (v < 100) return '.';
  if (v < 150) return '-';
  if (v < 200) return '+';
  const glyphs = '_=/'.split('');
  return random.pick(glyphs);
};

const onKeyUp = (event) => {
  text = event.key;
  console.log(`Key pressed: ${text}`);
  manager.render();
};

document.addEventListener('keyup', onKeyUp); 

const start = async () => {
  manager = await canvasSketch(sketch, settings);
};

start();

// canvasSketch(sketch, settings);
