import { ReferenceObject } from 'popper.js';

function getPosition(e: MouseEvent): ReferenceObject {
  const x = e.clientX;
  const y = e.clientY;
  const { scrollX: originalX, scrollY: originalY } = window;
  return {
    clientWidth: 0,
    clientHeight: 0,
    getBoundingClientRect(): ClientRect {
      const { scrollX, scrollY } = window;
      return {
        width: 0,
        height: 0,
        top: y - scrollY + originalY,
        bottom: y - scrollY + originalY,
        left: x - scrollX + originalX,
        right: x - scrollX + originalX
      };
    }
  };
}

export { getPosition };