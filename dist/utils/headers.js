"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHeader = void 0;
const getHeader = (header) => {
    if (Array.isArray(header))
        return header[0];
    return header ?? "unknown";
};
exports.getHeader = getHeader;
