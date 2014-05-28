var directions = ['top', 'right', 'bottom', 'left'];
function opposite(dir) {
    switch (dir) {
        case 'top':
            return 'bottom';
        case 'bottom':
            return 'top';
        case 'left':
            return 'right';
        case 'right':
            return 'left';
    }
}
function getDirection(from, to) {
    if (to.x == from.x) {
        if (to.y > from.y) {
            return 'bottom';
        } else {
            return 'top';
        }
    } else {
        if (to.x > from.x) {
            return 'right';
        } else {
            return 'left';
        }
    }
}

module.exports = {
    list: directions,
    opposite: opposite,
    get: getDirection
};
