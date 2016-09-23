function ChartLine(config) {
  var ctx = this.paper.ctx,
    width = this.paper.width,
    height = this.paper.height;

  var lineVariance = 2;

  var xPadding = 40;
  var yPadding = 40;
  var sets = config.datasets;

  var gridLines = {
    vertical: true,
    horizontal: true
  };

  if (config.gridLines) {
    if (config.gridLines.vertical === false)
      gridLines.vertical = false;

    if (config.gridLines.horizontal === false)
      gridLines.horizontal = false;
  }

  // Labels
  ctx.textAlign = "left"
  for (var i = 0; i < config.labels.length; i++) {
    if (gridLines.vertical) {
      ctx.beginPath();
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = '#e7e7e7';
      ctx.moveTo(getXPixel(i), height - yPadding + 10);
      ctx.lineTo(getXPixel(i), yPadding / lineVariance);
      ctx.stroke();
    }
    ctx.fillText(config.labels[i], getXPixel(i), height - yPadding + 20);
  }

  // for (var i = 0; i < config.labels.length; i++) {
  //   data.push({
  //     X: config.labels[i],
  //     Y: config.data[i]
  //   });
  // }

  function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
  }

  function getMaxY() {
    var max = 0;

    for (var i = 0; i < sets.length; i++) {
      var m = getMaxOfArray(sets[i].data)
      if (m > max) {
        max = m;
      }
    }

    max += 10 - max % 10;
    return max;
  }

  function getXPixel(val) {
    return ((width - xPadding) / config.labels.length) * val + xPadding;
  }

  function getYPixel(val) {
    return height - (((height - yPadding) / getMaxY()) * val) - yPadding;
  }

  ctx.lineWidth = 0.8;
  ctx.strokeStyle = '#999';
  ctx.font = 'normal 12px Helvetica';
  ctx.fillStyle = '#5e5e5e';
  ctx.textAlign = "center";

  ctx.beginPath();
  ctx.moveTo(xPadding, yPadding / lineVariance);
  ctx.lineTo(xPadding, height - yPadding);
  ctx.lineTo(width - (xPadding / lineVariance), height - yPadding);
  ctx.stroke()

  // Data
  ctx.textAlign = "right"
  ctx.textBaseline = "middle";
  for (var i = 0; i < getMaxY(); i += 10) {
    if (gridLines.horizontal) {
      ctx.beginPath();
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = '#e7e7e7';
      ctx.moveTo(xPadding - 5, getYPixel(i));
      ctx.lineTo(width - (xPadding / lineVariance), getYPixel(i));
      ctx.stroke();
    }
    ctx.fillText(i, xPadding - 10, getYPixel(i));
  }

  // Draw Lines
  for (var i = 0; i < sets.length; i++) {
    var set = sets[i],
      line = getBorderStyleObject(set.line || "1px solid #000");
    ctx.beginPath();
    ctx.lineWidth = line.borderSize;
    ctx.setLineDash(line.borderStyle);
    ctx.strokeStyle = line.borderColor;
    ctx.moveTo(getXPixel(0), getYPixel(set.data[0]));

    for (var x = 1; x < set.data.length; x++) {
      ctx.lineTo(getXPixel(x), getYPixel(set.data[x]));
    }
    ctx.stroke();
    ctx.setLineDash([]);

    if (set.points) {
      ctx.fillStyle = (set.pointsColor) ? set.pointsColor : 'rgb(75,75,75)';
      for (var rael = 0; rael < set.data.length; rael++) {
        ctx.beginPath();
        ctx.arc(getXPixel(rael), getYPixel(set.data[rael]), 3, 0, Math.PI * 2, true);
        ctx.fill();
      }
    }
    ctx.closePath();
  }
}

Screen.prototype.chartLine = ChartLine;

Origami.chartLine = function(config) {
  queue('chartLine', config);
  return this;
};