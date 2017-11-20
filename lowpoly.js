var temp;

window.onload=function(){
    var c=document.getElementById("low-poly-box");
    var ctx=c.getContext("2d");
    c.height=ctx.canvas.clientHeight;
    c.width=ctx.canvas.clientWidth;
    drawLowPoly(ctx,c);
}

function drawLowPoly(context, element){
    var H=context.canvas.clientHeight;
    var W=context.canvas.clientWidth;
    var h=parseInt(element.getAttribute("pixelheight"));
    var w=parseInt(element.getAttribute("pixelwidth"));
    var points=[[0,H-h],[0,H]];
    for(i=1;i<4;i++){
        points.push([0,H-i*h/4]);
        points.push([i*w/4,H]);
    }
    for(i=0;i<50;i++){
        var x=Math.random()*w;
        var y=H-Math.random()*(h-x);
        points.push([x,y]);
        context.fillRect(points[i][0],points[i][1],1,1);
    }
    /*
    Generate w/ same number of triangles
    Generate w/ same number of outer triangles (only 2 neighbors)
    Map each triangle to another
    
    */
    var ts=delauney(points);
    temp=function(){
        var a=getOuterTriangles(ts);
        a.forEach(function(t){
            var gray=255;
            context.fillStyle="rgb(0,0,"+gray+")";
            context.beginPath();
            t.forEach(function(v){
                context.lineTo(v[0],v[1]);
            });
            context.closePath();
            context.fill();
        })
        console.log(a.length);
        var tPoints=[[0,0],[W,0],[W,H],[0,H]];
        for(i=4;i<a.length;i++){
            var x=i%4;
            switch(x){
                case 1:
                    tPoints.push([0,Math.random()*(H-10)+5]);
                    break;
                case 2:
                    tPoints.push([W,Math.random()*(H-10)+5]);
                    break;
                case 3:
                    tPoints.push([Math.random()*(W-10)+5,0]);
                    break;
                case 0:
                    tPoints.push([Math.random()*(W-10)+5,H]);
                    break;
            }
        }
        for(i=a.length;i<points.length;i++){
            tPoints.push([Math.random()*(W-10)+5,Math.random()*(H-10)+5]);
        }
        var b=delauney(tPoints);
        console.log(getOuterTriangles(b).length);
        b.forEach(function(t){
            var gray=Math.round(Math.random()*255);
            context.fillStyle="rgb(0,0,"+gray+")";
            context.beginPath();
            t.forEach(function(v){
                context.lineTo(v[0],v[1]);
            });
            context.closePath();
            context.fill();
        })
        return null;
    }
    ts.forEach(function(t){
        var gray=Math.round(Math.random()*255);
        context.fillStyle="rgb("+gray+","+gray+","+gray+")";
        context.beginPath();
        t.forEach(function(v){
            context.lineTo(v[0],v[1]);
        });
        context.closePath();
        context.fill();
    })
}

function delauney(points){
    var st=superTriangle(points);
    var triangles=[st];
    points.forEach(function(v){
        var buffer=[];
        for(i=triangles.length-1;i>=0;i--){
            var t=triangles[i];
            if(isInCircumcircle(t,v)){
                getEdges(t).forEach(function(e){
                    buffer.push(e);
                });
                triangles.splice(i,1);
            }
        }
        buffer=removeDuplicateEdges(buffer);
        buffer.forEach(function(e){
            if(!hasVertex(e,v)){
                triangles.push(getTriangle(e,v));
            }
        });
    });
    for(i=triangles.length-1;i>=0;i--){
        var t=triangles[i];
        for(j=0;j<3;j++){
            var v=st[j];
            if(hasVertex(t,v)){
               triangles.splice(i,1);
               break;
           } 
        }
    }
    return triangles;
    
}

function getOuterTriangles(triangles){
    var temp=[];
    var adMat=[];
    for(i=0;i<triangles.length;i++)
        adMat.push(0);
    for(r=0;r<triangles.length;r++){
        for(c=r+1;c<triangles.length;c++){
            if(sharesEdge(triangles[r],triangles[c])){
                    adMat[r]++;
                    adMat[c]++;
            }
        }
    }
    for(r=0;r<triangles.length;r++){
        if(adMat[r]==2)
            temp.push(triangles[r]);
    }
    return temp;
}

function sharesEdge(a,b){
    var A=getEdges(a);
    var B=getEdges(b);
    for(i=0;i<3;i++)
        for(j=0;j<3;j++)
            if(equal(A[i],B[j]))
                return true;
    return false;
}

function hasVertex(triangle, vertex){
    for(loopVar=0;loopVar<triangle.length;loopVar++){
        var v=triangle[loopVar];
        if(v[0]==vertex[0]&&v[1]==vertex[1])
            return true;
    }
    return false;
}

function getTriangle(edge, vertex){
    return [edge[0],edge[1],vertex];
}                      

function removeDuplicateEdges(buffer){
    var ret=[];
    buffer.forEach(function(e){
        var count=0;
        buffer.forEach(function(e1){
            if(equal(e,e1))
                count++;
        })
        if(count==1)
            ret.push(e);
    })
    return ret;
}

function equal(a,b){
    return (a[0][0]==b[0][0]&&a[0][1]==b[0][1]&&a[1][0]==b[1][0]&&a[1][1]==b[1][1])||(a[1][0]==b[0][0]&&a[1][1]==b[0][1]&&a[0][0]==b[1][0]&&a[0][1]==b[1][1]);
}

function getEdges(triangle){
    var a=triangle[0];
    var b=triangle[1];
    var c=triangle[2];
    return [[a,b],[a,c],[b,c]];
}

function isInCircumcircle(triangle, vertex){
    var circumcenter=getCircumcenter(triangle);
    return squaredDistance(vertex,circumcenter[0])<=circumcenter[1];
}

function squaredDistance(a,b){
    return Math.pow(a[0]-b[0],2)+Math.pow(a[1]-b[1],2);
}

function getCircumcenter(triangle){
    var midpointAB=[(triangle[0][0]+triangle[1][0])/2,(triangle[0][1]+triangle[1][1])/2];
    var orthoSlopeAB=triangle[1][0]-triangle[0][0];
        if(triangle[0][1]-triangle[1][1]==0){
            midpointAB=[(triangle[0][0]+triangle[2][0])/2,(triangle[0][1]+triangle[2][1])/2];
            orthoSlopeAB=(triangle[2][0]-triangle[0][0])/(triangle[0][1]-triangle[2][1]);
        }else
            orthoSlopeAB/=(triangle[0][1]-triangle[1][1]);
        var midpointBC=[(triangle[2][0]+triangle[1][0])/2,(triangle[2][1]+triangle[1][1])/2];
        var orthoSlopeBC=triangle[1][0]-triangle[2][0];
        if(triangle[2][1]-triangle[1][1]==0){
            midpointBC=[(triangle[2][0]+triangle[0][0])/2,(triangle[2][1]+triangle[0][1])/2];
            orthoSlopeBC=(triangle[2][0]-triangle[0][0])/(triangle[0][1]-triangle[2][1]);
        }else
            orthoSlopeBC/=(triangle[2][1]-triangle[1][1]);
        var slopeDifference=orthoSlopeAB-orthoSlopeBC;
        var x=(orthoSlopeAB*midpointAB[0]-orthoSlopeBC*midpointBC[0]+midpointBC[1]-midpointAB[1])/slopeDifference;
        var y=orthoSlopeAB*(x-midpointAB[0])+midpointAB[1];
        cCenter=[x,y]
        var radius=squaredDistance(triangle[0],cCenter);
        return [cCenter,radius];
}

function superTriangle(points){
    var dimensions=[10000,-10000,10000,-10000];
    points.forEach(function(element){
        dimensions[0]=Math.min(dimensions[0],element[0]);
        dimensions[2]=Math.min(dimensions[2],element[1]);
        dimensions[1]=Math.max(dimensions[1],element[0]);
        dimensions[3]=Math.max(dimensions[3],element[1]);
    });
    dimensions[0]-=5;
    dimensions[1]+=5;
    dimensions[2]-=5;
    dimensions[3]+=5;
    var width=dimensions[1]-dimensions[0];
    var height=dimensions[3]-dimensions[2];
    return [[dimensions[0],dimensions[3]],[dimensions[0]+2*width,dimensions[3]],[dimensions[0],dimensions[3]-2*height]];
}