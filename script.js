const H = 35, R = 60, scale = 8, groundY = 340, centerX = 340;
const poleL = document.getElementById('poleL'), poleR = document.getElementById('poleR');
const topL = document.getElementById('topL'), topR = document.getElementById('topR');
const rope = document.getElementById('rope'), dLabel = document.getElementById('dLabel');
const clearLine = document.getElementById('clearLine'), clearLabel = document.getElementById('clearLabel');
const slider = document.getElementById('slider'), sliderVal = document.getElementById('sliderVal');
const cVal = document.getElementById('cVal'), sagVal = document.getElementById('sagVal'), dVal = document.getElementById('dVal');

// Given a desired clearance c (height of rope's lowest point above ground),
// solve the catenary parameters: a (scale), t (shape param), L (half pole-spacing).
function geometry(c) {
  const sag = H - c;
  const sHalf = R / 2;
  let x = sag / sHalf;
  x = Math.min(Math.max(x, 0.0002), 0.9998); // avoid exact 0/1 singularities
  const t = 2 * Math.atanh(x);
  const a = sHalf / Math.sinh(t);
  const L = a * t;
  return { a, t, L, D: 2 * L, sag };
}

function render(c) {
  const g = geometry(c);
  const poleTopY = groundY - H * scale;
  const clearY = groundY - c * scale;
  const halfPx = g.L * scale;
  const xL = centerX - halfPx, xR = centerX + halfPx;

  poleL.setAttribute('x', xL - 3); poleL.setAttribute('y', poleTopY); poleL.setAttribute('height', groundY - poleTopY);
  poleR.setAttribute('x', xR - 3); poleR.setAttribute('y', poleTopY); poleR.setAttribute('height', groundY - poleTopY);
  topL.setAttribute('cx', xL); topL.setAttribute('cy', poleTopY);
  topR.setAttribute('cx', xR); topR.setAttribute('cy', poleTopY);

  let d = '';
  const N = 48;
  for (let i = 0; i <= N; i++) {
    const xm = -g.L + (2 * g.L * i / N);
    const yLocal = g.a * (Math.cosh(xm / g.a) - 1);
    const yAbs = c + yLocal;
    const px = centerX + xm * scale;
    const py = groundY - yAbs * scale;
    d += (i === 0 ? 'M' : 'L') + px.toFixed(1) + ' ' + py.toFixed(1) + ' ';
  }
  rope.setAttribute('d', d);

  clearLine.setAttribute('y1', clearY); clearLine.setAttribute('y2', clearY);
  clearLabel.setAttribute('y', clearY - 6);
  clearLabel.textContent = 'clearance ' + c.toFixed(1) + ' m';

  dLabel.textContent = 'pole spacing: ' + g.D.toFixed(1) + ' m';
  cVal.textContent = c.toFixed(1) + ' m';
  sagVal.textContent = g.sag.toFixed(1) + ' m';
  dVal.textContent = g.D.toFixed(1) + ' m';
  sliderVal.textContent = c.toFixed(1) + ' m';
}

slider.addEventListener('input', () => render(parseFloat(slider.value)));
function setC(c) { slider.value = c; render(c); }
render(20);
