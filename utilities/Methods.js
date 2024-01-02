import {Shared} from './Shared';

export const adjustGesture = (move_x, move_y) => {
  let _x = move_x;
  let _y = move_y;
  let adjustedx = false;
  let adjustedy = false;
  const scaledTargetSize = Shared.targetSize * Shared.lastScale;
  if (
    _x < Shared.playAreaSize.x ||
    _x > Shared.playAreaSize.x + Shared.playAreaSize.width
  ) {
    _x = -1;
  } else if (
    _x >
    Shared.playAreaSize.x + Shared.playAreaSize.width - scaledTargetSize / 2
  ) {
    _x =
      Shared.playAreaSize.x + Shared.playAreaSize.width - scaledTargetSize / 2;
    adjustedx = true;
  } else if (_x < Shared.playAreaSize.x + scaledTargetSize / 2) {
    _x = Shared.playAreaSize.x + scaledTargetSize / 2;
    adjustedx = true;
  }

  if (
    _y < Shared.playAreaSize.y ||
    _y > Shared.playAreaSize.y + Shared.playAreaSize.height
  ) {
    _y = -1;
  } else if (
    _y >
    Shared.playAreaSize.y + Shared.playAreaSize.height - scaledTargetSize / 2
  ) {
    _y =
      Shared.playAreaSize.y + Shared.playAreaSize.height - scaledTargetSize / 2;
    adjustedy = true;
  } else if (_y < Shared.playAreaSize.y + scaledTargetSize / 2) {
    _y = Shared.playAreaSize.y + scaledTargetSize / 2;
    adjustedy = true;
  }

  if (_x != -1) {
    _x =
      Shared.playAreaSize.width / 2 -
      Shared.lastPanX -
      Shared.playAreaSize.width / 2 / Shared.lastScale +
      (_x - Shared.playAreaSize.x) / Shared.lastScale;
  }
  if (_y != -1) {
    _y =
      Shared.playAreaSize.height / 2 -
      Shared.lastPanY -
      Shared.playAreaSize.height / 2 / Shared.lastScale +
      (_y - Shared.playAreaSize.y) / Shared.lastScale;
  }
  return {x: _x, y: _y, adjusted: {x: adjustedx, y: adjustedy}};
};

export const getTargetIdx = (x, y) => {
  _x =
    Shared.playAreaSize.width / 2 -
    Shared.lastPanX -
    Shared.playAreaSize.width / 2 / Shared.lastScale +
    (x - Shared.playAreaSize.x) / Shared.lastScale;
  const idx_x = Math.floor(_x / Shared.targetSize);

  _y =
    Shared.playAreaSize.height / 2 -
    Shared.lastPanY -
    Shared.playAreaSize.height / 2 / Shared.lastScale +
    (y - Shared.playAreaSize.y) / Shared.lastScale;
  const idx_y = Math.floor(_y / Shared.targetSize);

  return {column: idx_x, row: idx_y};
};
