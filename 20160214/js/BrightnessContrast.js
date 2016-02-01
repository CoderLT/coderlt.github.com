var brightnessContrast = function(__src, __brightness, __contrast){
    __src || error(arguments.callee, IS_UNDEFINED_OR_NULL/* {line} */);
    if(__src.type === "CV_RGBA"){
        var sData = __src.data,
            width = __src.col,
            height = __src.row,
            dst = new Mat(height, width, CV_RGBA),
            dData = dst.data,
            brightness = Math.max(-255, Math.min(255, __brightness || 0)),
            contrast = Math.max(-255, Math.min(255, __contrast || 0));
        
        var gray = cvtColor(__src, CV_RGBA2GRAY),
            allValue = 0,
            gData = gray.data;
        var y, x, c;
        
        for(y = height; y--;){
            for(x = width; x--;){
                allValue += gData[y * width + x];
            }
        }
        
        var r, g, b, offset, gAverage = (allValue / (height * width)) | 0;
        
        for(y = height; y--;){
            for(x = width; x--;){
                offset = (y * width + x) * 4;
                dData[offset] = sData[offset] + brightness; 
                dData[offset + 1] = sData[offset + 1] + brightness; 
                dData[offset + 2] = sData[offset + 2] + brightness; 
            
                if(contrast >= 0){ 
                    for(c = 3; c--;){ 
                        if(dData[offset + c] >= gAverage){ 
                            dData[offset + c] = dData[offset + c] + (255 - gAverage) * contrast / 255; 
                        }else{ 
                            dData[offset + c] = dData[offset + c] - (gAverage * contrast / 255); 
                        } 
                    } 
                }else{
                    dData[offset] = dData[offset] + (dData[offset] - gAverage) * contrast / 255; 
                    dData[offset + 1] = dData[offset + 1] + (dData[offset + 1] - gAverage) * contrast / 255; 
                    dData[offset + 2] = dData[offset + 2] + (dData[offset + 2] - gAverage) * contrast / 255; 
                }
                
                dData[offset + 3] = 255;
            }
        }
    }else{
        error(arguments.callee, UNSPPORT_DATA_TYPE/* {line} */);
    }
    return dst;
};