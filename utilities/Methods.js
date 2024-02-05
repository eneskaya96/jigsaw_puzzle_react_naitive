import { PIECE_SIZE } from './Constants';
import {Shared} from './Shared';


export const adjustPosition = (move_x, move_y) => {
    if(move_y < Shared.basePlayAreaSize.y) {
        return {x: 0, y: 0, status: 0};
    }
    else if(move_y > Shared.basePlayAreaSize.y + Shared.basePlayAreaSize.height && 
        move_y < Shared.basePlayAreaSize.y + Shared.basePlayAreaSize.height + PIECE_SIZE + 20) {
        return {x: move_x, y: 0, status: 1};
    }
    else if( move_y >= Shared.basePlayAreaSize.y + Shared.basePlayAreaSize.height + PIECE_SIZE + 20) {
        return {x: 0, y: 0, status: 0};
    }

    let _play_x = (Shared.playAreaSize.x + Shared.playAreaSize.width/2) - 
    (Shared.playAreaSize.width * Shared.lastScale / 2) + Shared.lastPanX * Shared.lastScale;
    let _play_width = Shared.playAreaSize.width * Shared.lastScale;

    let _play_y = (Shared.basePlayAreaSize.y + Shared.playAreaSize.y + Shared.playAreaSize.height/2) - 
    (Shared.playAreaSize.height * Shared.lastScale / 2) + Shared.lastPanY * Shared.lastScale;
    let _play_height = Shared.playAreaSize.height * Shared.lastScale;

    let point_x = move_x - _play_x;
    let point_y = move_y - _play_y;

    const scaledTargetSize_half = Shared.targetSize * Shared.lastScale / 2;
    if(point_x < scaledTargetSize_half) {point_x = scaledTargetSize_half;}
    else if(point_x > _play_width - scaledTargetSize_half) {point_x = _play_width - scaledTargetSize_half;}

    if(point_y < scaledTargetSize_half) {point_y = scaledTargetSize_half;}
    else if(point_y > _play_height - scaledTargetSize_half) {point_y = _play_height - scaledTargetSize_half;}

    point_x /= Shared.lastScale;
    point_y /= Shared.lastScale;

    return {x: point_x, y: point_y, status: 2};

}
