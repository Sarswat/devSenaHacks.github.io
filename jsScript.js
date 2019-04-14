
	<script type="text/javascript">
      var originGeo = [16.8286, 52.4200];
      var originName = 'POZ';

      var destinations = [
          {'coord': [20.9679, 52.1672], 'name': 'WAW', 'capacity': '650MW'},
          {'coord': [23.9569, 49.8134], 'name': 'LWO', 'capacity': '850MW'},
          {'coord': [30.4433, 50.4120], 'name': 'IEV', 'capacity': '900MW'},
          {'coord': [13.3724, 55.5355], 'name': 'MMX', 'capacity': '1200MW'},
          {'coord': [12.6508, 55.6180], 'name': 'CPH', 'capacity': '4541MW'},
          {'coord': [16.9154, 58.7890], 'name': 'NYO', 'capacity': '856MW'},
          {'coord': [10.2569, 59.1824], 'name': 'TRF', 'capacity': '8562MW'},
          {'coord': [9.1526, 55.7408], 'name': 'BLL', 'capacity': '4512MW'},
          {'coord': [8.5622, 50.0379], 'name': 'FRA', 'capacity': '4562MW'},
          {'coord': [11.7750, 48.3537], 'name': 'MUC', 'capacity': '900MW'},
          {'coord': [5.3921, 51.4584], 'name': 'EIN', 'capacity': '565MW'},
          {'coord': [2.1115, 49.4545], 'name': 'BVA', 'capacity': '545MW'},
          {'coord': [-2.7135, 51.3836], 'name': 'BRS', 'capacity': '595MW'},
          {'coord': [0.3717, 51.8763], 'name': 'LTN', 'capacity': '966MW'},
          {'coord': [0.2389, 51.8860], 'name': 'STN', 'capacity': '9878MW'},
          {'coord': [-1.743507, 52.4524], 'name': 'BHX', 'capacity': '858MW'},
          {'coord': [-2.8544, 53.3375], 'name': 'LPL', 'capacity': '862MW'},
          {'coord': [-3.3615, 55.9508], 'name': 'EDI', 'capacity': '963MW'},
          {'coord': [-1.010464, 53.480662], 'name': 'DSA', 'capacity': '333MW'},
          {'coord': [-6.2499, 53.4264], 'name': 'DUB', 'capacity': '920MW'},
          {'coord': [-0.560056, 38.285483], 'name': 'ALC', 'capacity': '900MW'},
          {'coord': [0.065603, 40.207479], 'name': 'CDT', 'capacity': '800MW'},
          {'coord': [-3.56795, 40.4839361], 'name': 'MAD', 'capacity': '953MW'},
          {'coord': [2.071062, 41.288288], 'name': 'BCN', 'capacity': '323MW'},
          {'coord': [2.766066, 41.898201], 'name': 'GRO', 'capacity': '111MW'},
          {'coord': [14.483279, 35.854114], 'name': 'MLA', 'capacity': '951MW'},
          {'coord': [23.9484, 37.9356467], 'name': 'ATH', 'capacity': '858MW'},
          {'coord': [19.914486, 39.607645], 'name': 'CFU', 'capacity': '8526MW'},
          {'coord': [34.9362, 29.9511], 'name': 'VDA', 'capacity': '226MW'},
          {'coord': [34.8854, 32.0055], 'name': 'TLV', 'capacity': '500MW'}
      ];
      var svg;
      var projection;
	  //var originPos = projection(this.originGeo);
      var speed = 2800;//km/sec


      var tooltip = d3.select('#map').append('div')
          .attr('class', 'tooltipDestination')
          .style('opacity', 0);
      function getArc(d, s) {
        var dx = d.destination.x - d.origin.x;
        var dy = d.destination.y - d.origin.y;
        var dr = Math.sqrt(dx * dx + dy * dy);
        var spath = s == false ? ' 0 0,0 ' : ' 0 0,1 ';
        return 'M' + d.origin.x + ',' + d.origin.y + 'A' + dr + ',' + dr + spath + d.destination.x + ',' + d.destination.y;
      }

      function calculateDistance(lat1, lon1, lat2, lon2) {
        var p = 0.017453292519943295;
        var c = Math.cos;
        var a = 0.5 - c((lat2 - lat1) * p)/2 + c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))/2;
        return 12742 * Math.asin(Math.sqrt(a));
      }

      function calculateDuration(distance) {
        return (distance / this.speed) * 1000;
      }


		function drawAllDestination(indexs){
		var nextIndex = indexs + 1;
		for ( indexs = 0; indexs < destinations.length; indexs++) {
		  drawPoint(indexs);
		}
		drawConnection(0);
        }


      function drawConnection(index) {
	  debugger;
	  //alert("connection");
		var destination = this.destinations[index];
		var originPos = null;
        if(index == 0){
		 originPos = projection(this.originGeo);
		}
		else{
		var oldIndex = index - 1;
		var oldDestination = this.destinations[oldIndex];
		originPos = projection(oldDestination.coord);
		}
        var destinationPos = projection(destination.coord);
		var capacity = destination.capacity;
        var connection = [ originPos, destinationPos ];
        var destinationName = destination.name;
        var originGeo = this.originGeo;
        var destinationGeo = destination.coord;
        var svg = this.svg;
        var distance = calculateDistance(originGeo[1], originGeo[0], destinationGeo[1], destinationGeo[0]);
        var duration = calculateDuration(distance);
        var arc = svg
          .append('path')
          .datum(connection)
          .attr('class', 'arc' + index)
          .attr('d', function(coordinates) {
              var d = {
                  origin: { x: coordinates[0][0], y: coordinates[0][1]},
                  destination: { x: coordinates[1][0], y: coordinates[1][1]}
              };
              var s = false;
              if (d.destination.x > d.origin.x) {
                  s = true;
              }
              return getArc(d, s);
          })
          .style('stroke', 'green')
          .style('stroke-width', 1)
          .style('fill', 'none')
		  .on('mouseover', function (d) {
                  tooltip.html('<span style="color:white">' + 'Path Name : '+destinationName + '<br> Maximum Capacity : '+ capacity +' <br> Loss % : 3.9' + '</span>')
                    .attr('class', 'tooltipDestination')
                    .style('left', d[0] + 12 + 'px')
                    .style('top', d[1] - 20 + 'px')
                    .transition()
                    .duration(700)
                    .style('opacity', 1)
                })
          .transition()
          .duration(duration)
          .attrTween('stroke-dasharray', function() {
              var len = this.getTotalLength();
              return function(t) {
                return (d3.interpolate('0,' + len, len + ',0'))(t)
              };
          })

          .on('end', function(d) {
              var c = connection[1];
              svg.append('circle')
                .attr('cx', c[0])
                .attr('cy', c[1])
                .attr('r', 0)
                .attr('class', 'destCircleInner')
                .style('fill', 'steelblue')
                .style('fill-opacity', '1')
				.on('mouseover', function (d) {
                  tooltip.html('<span style="color:white">' + 'Hub Name : '+destinationName + '<br> Maximum Capacity : '+ capacity +' <br> Loss % : 3.9' + '</span>')
                    .attr('class', 'tooltipDestination')
                    .style('left', d[0] + 12 + 'px')
                    .style('top', d[1] - 20 + 'px')
                    .transition()
                    .duration(700)
                    .style('opacity', 1)
                })
                .transition()
                .duration(300)
                .attr('r', '3px')
				;
              svg.append('circle')
                .attr('cx', c[0])
                .attr('cy', c[1])
                .attr('r', 0)
                .attr('class', 'destCircleOuter')
                .style('fill', 'black')
                .style('fill-opacity', '0.05')
				.on('mouseover', function (d) {
                  tooltip.html('<span style="color:white">' + 'Hub Name : '+destinationName + '<br> Maximum Capacity : '+ capacity +' <br> Loss % : 3.9' + '</span>')
                    .attr('class', 'tooltipDestination')
                    .style('left', d[0] + 12 + 'px')
                    .style('top', d[1] - 20 + 'px')
                    .transition()
                    .duration(700)
                    .style('opacity', 1)
                })
                .on('mouseout', function (d) {
                  tooltip.transition()
                  .duration(700)
                  .style('opacity', 0)
                })
                .transition()
                .duration(300)
                .attr('r', '10px');
              svg.append('circle')
                .datum(c)
                .attr('cx', c[0])
                .attr('cy', c[1])
                .attr('r', 10)
                .style('class', 'destCircleMouse')
                .style('fill', 'red')
                .style('fill-opacity', '1')
                .on('mouseover', function (d) {
                  tooltip.html('<span style="color:white">' + 'Hub Name : '+destinationName + '<br> Maximum Capacity : '+ capacity +' <br> Loss % : 3.9' + '</span>')
                    .attr('class', 'tooltipDestination')
                    .style('left', d[0] + 12 + 'px')
                    .style('top', d[1] - 20 + 'px')
                    .transition()
                    .duration(700)
                    .style('opacity', 1)
                })
                .on('mouseout', function (d) {
                  tooltip.transition()
                  .duration(700)
                  .style('opacity', 0)
                })
                .transition()
                .duration(300)
                .attr('r', '3px')
                .on('end', function(d) {
                  d3.select(this)
                    .transition()
                    .duration(2000)
                    .attr('r', 20)
                    .style('fill-opacity', '0.5');
                  d3.select('.arc' + index)
                    .transition()
                    .duration(2000)
                    .style('stroke-opacity', '0.5')
                    .style('stroke-width', '2')
                    .on('end', function (d) {
                      if (index === destinations.length - 1) {
                        svg.selectAll('.destCircleInner').remove();
                        svg.selectAll('.destCircleOuter').remove();
                        svg.selectAll('.destCircleMouse').remove();
                        for (i = 0; i < destinations.length; i++) {
                          svg.selectAll('.arc' + i).remove();
                        }
                      }
                      var nextIndex = index + 1;
					  //originGeo = destinationGeo;
                      if (nextIndex < destinations.length) {
                        drawConnection(nextIndex);
                      } else {
                        drawConnection(0);
                      }
                    })
                });
          });
      }

	  function drawPoint(indexs){
	  debugger;
	  var destination = this.destinations[indexs];
        var originPos = projection(this.originGeo);
        var destinationPos = projection(destination.coord);
        var connection = [ originPos, destinationPos ];
        var destinationName = destination.name;
        var originGeo = this.originGeo;
        var destinationGeo = destination.coord;
		var capacity = destination.capacity;
        var svg = this.svg;
        var distance = calculateDistance(originGeo[1], originGeo[0], destinationGeo[1], destinationGeo[0]);
        var duration = calculateDuration(distance);
             var c = connection[1];
              svg.append('circle')
                .attr('cx', c[0])
                .attr('cy', c[1])
                .attr('r', 0)
                .attr('class', 'destCircleInner')
                .style('fill', 'steelblue')
                .style('fill-opacity', '1')
                .transition()
                .duration(300)
                .attr('r', '3px');
              svg.append('circle')
                .attr('cx', c[0])
                .attr('cy', c[1])
                .attr('r', 0)
                .attr('class', 'destCircleOuter')
                .style('fill', 'black')
                .style('fill-opacity', '0.05')
                .transition()
                .duration(300)
                .attr('r', '10px');
              svg.append('circle')
                .datum(c)
                .attr('cx', c[0])
                .attr('cy', c[1])
                .attr('r', 1)
                .style('class', 'destCircleMouse')
                .style('fill', 'red')
                .style('fill-opacity', '1')
                .on('mouseover', function (d) {
                  tooltip.html('<span style="color:white">' + 'Hub Name : '+destinationName + '<br> Maximum Capacity : '+ capacity +'</span>')
                    .attr('class', 'tooltipDestination')
                    .style('left', d[0] + 12 + 'px')
                    .style('top', d[1] - 20 + 'px')
                    .transition()
                    .duration(700)
                    .style('opacity', 1)
                })
                .on('mouseout', function (d) {
                  tooltip.transition()
                  .duration(700)
                  .style('opacity', 0)
                })
                .transition()
                .duration(300)
                .attr('r', '3px')
                ;

      }


      function drawConnections() {
        drawAllDestination(0);
      }

      function drawMap(originName, originGeo, destinations) {
	  alert("call Map");
        var countries, height, path, projection, scale, svg, width;
        var width = 800;
        var height = 800;
        var center = [4, 68.6];
        var scale = 700;
        projection = d3.geoMercator().scale(scale).translate([width / 2, 0]).center(center);
        path = d3.geoPath().projection(projection);
        svg = d3.select('#map').append('svg')
          .attr('height', height)
          .attr('width', width)
          .style('background', '#C1E1EC');
        countries = svg.append("g");
        d3.json('europe.json', function(data) {
          countries.selectAll('.country')
          .data(topojson.feature(data, data.objects.europe).features)
          .enter()
          .append('path')
          .attr('class', 'country')
          .attr('d', path)
          return;
        });
        var source = svg.selectAll('circleOrigin');
          source
          .data([originGeo]).enter()
          .append('circle')
          .attr('cx', function (d) { return projection(d)[0]; })
          .attr('cy', function (d) { return projection(d)[1]; })
          .attr('r', '3px')
          .style('opacity', 1)
          .attr('fill', 'green')
          .attr('class', 'circleOrigin')
          source
          .data([originGeo]).enter()
          .append('circle')
          .attr('cx', function (d) { return projection(d)[0]; })
          .attr('cy', function (d) { return projection(d)[1]; })
          .attr('r', '10px')
          .style('opacity', 0.05)
          .attr('fill', 'black')
          .attr('class', 'circleOrigin')
          .on('mouseover', function (d) {
            tooltip.html('<span style="color:white">' + "Hub Name : "+originName + "<br> Maximum Capacity : 650MW <br> Loss % : 3.9" +'</span>')
              .attr('class', 'tooltipOrigin')
              .style('left', projection(d)[0] + 12 + 'px')
              .style('top', projection(d)[1] - 20 + 'px')
              .transition()
              .duration(700)
              .style('opacity', 1)
          })
          .on('mouseout', function (d) {
            tooltip.transition()
              .duration(700)
              .style('opacity', 0)
          });
        this.svg = svg;
        this.projection = projection;
        this.drawConnections();
      };

      this.drawMap(this.originName, this.originGeo, this.destinations);
	  //drawAllDestination(0);
    </script>
