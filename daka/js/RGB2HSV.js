function setRGBWithOffsetHSV(_R,_G,_B,_H,_S,_V){var maxJ=Math.max(_R,_G,_B);var minJ=Math.min(_R,_G,_B);var Sax=maxJ-minJ;if(_R==_G&&_G==_B){H=0;S=0}else{switch(maxJ){case _R:H=(_G-_B)/Sax;case _G:H=2+(_B-_R)/Sax;case _B:H=4+(_R-_G)/Sax}H*=60;if(H<0){H+=360}H=Math.round(H);S=Math.round(100*(maxJ-minJ)/maxJ)}V=Math.round(100*maxJ/255);H=Math.round((H+_H)%360);S=Math.round(Math.max(Math.min(100,S*_S/100),0));V=Math.round(Math.max(Math.min(100,V*_V/100),0));if(S==0){H=S=V=Math.round(255*V/100);newR=H;newG=S;newB=V}else{S=S/100;V=V/100;p=Math.floor(H/60)%6;f=H/60-p;a=V*(1-S);b=V*(1-S*f);c=V*(1-S*(1-f));switch(p){case 0:newR=V;newG=c;newB=a;break;case 1:newR=b;newG=V;newB=a;break;case 2:newR=a;newG=V;newB=c;break;case 3:newR=a;newG=b;newB=V;break;case 4:newR=c;newG=a;newB=V;break;case 5:newR=V;newG=a;newB=b;break}newR=Math.round(255*newR);newG=Math.round(255*newG);newB=Math.round(255*newB)}return[newR,newG,newB]};