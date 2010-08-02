Raphael.fn.connection = function (obj1, obj2, line, bg) {

    if (obj1.line && obj1.from && obj1.to) {
        line = obj1;
        obj1 = line.from;
        obj2 = line.to;
    }
    var bb1 = obj1.getBBox(),
        bb2 = obj2.getBBox(),
        p = [{x: bb1.x + bb1.width / 2, y: bb1.y - 1},
        {x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
        {x: bb1.x - 1, y: bb1.y + bb1.height / 2},
        {x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},
        {x: bb2.x + bb2.width / 2, y: bb2.y - 1},
        {x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
        {x: bb2.x - 1, y: bb2.y + bb2.height / 2},
        {x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}],
        d = {}, dis = [];
    for (var i = 0; i < 4; i++) {
        for (var j = 4; j < 8; j++) {
            var dx = Math.abs(p[i].x - p[j].x),
                dy = Math.abs(p[i].y - p[j].y);
            if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                dis.push(dx + dy);
                d[dis[dis.length - 1]] = [i, j];
            }
        }
    }
    if (dis.length == 0) {
        var res = [0, 4];
    } else {
        res = d[Math.min.apply(Math, dis)];
    }
    var x1 = p[res[0]].x,
        y1 = p[res[0]].y,
        x4 = p[res[1]].x,
        y4 = p[res[1]].y;
    dx = Math.max(Math.abs(x1 - x4) / 2, 10);
    dy = Math.max(Math.abs(y1 - y4) / 2, 10);
    var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
        y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
        x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
        y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
    var path = ['M', x1.toFixed(3), y1.toFixed(3), 'C', x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(',');
    if (line && line.line) {
        line.bg && line.bg.attr({path: path});
        line.line.attr({path: path});
    } else {
        var color = typeof line == 'string' ? line : '#000';
        
        //console.log(bg && bg.split && this.path(path).attr({stroke: bg.split('|')[0], fill: 'none', 'stroke-width': bg.split('|')[1] || 3}));
        return {
            bg: bg && bg.split && this.path(path).attr({stroke: bg.split('|')[0], fill: 'none', 'stroke-width': bg.split('|')[1] || 3}),
            line: this.path(path).attr({stroke: color, fill: 'none'}),
            from: obj1,
            to:   obj2
        };
    }
};

(function ($) {
  $.isEven  = function (num) {
    return +num % 2 === 0 ? true : false;
  }
})(jQuery);

/*

TODO:

  ALL FUNCTIONS SHOULD BE MOVED INTO AN OBJ LITERAL NS
  
*/


$(function () {

  var 
  //  blank canvas
  $canvas = Raphael('canvas', 960, 650);
  //  white stage
  $stage  = $canvas.rect(0, 0, 960, 650, 10).attr({fill: '#fff', stroke: 'none'}),//'#999'
  
  
  //  INTERFACE
  ui  = {
    defaults: {
      layout: {fill: '#fff',    stroke: '#333333',   'stroke-width': 2},
      label:  {font: '12px Monospace', fill: '#000', 'font-weight': 'bold'}
    }
  };
  
  $.extend(ui, {
    rows: {
      count: 3,
      coords: [
        [ [0, 300, 960, 50, 0] ],
        [ [10, 10, 300, 300, 10],[330, 10, 300, 300, 10],[650, 10, 300, 300, 10] ],

        [ [10, 340, 300, 300, 10],[330, 340, 300, 300, 10],[650, 340, 300, 300, 10] ]
      ],
      attrs:  [
        [ $.extend({}, ui.defaults.layout, { fill: '#666' })      ],
        [ 
          $.extend({}, ui.defaults.layout, { stroke: 'purple' }),
          ui.defaults.layout,
          $.extend({}, ui.defaults.layout, { stroke: 'yellow' })
        ],

        [ ui.defaults.layout, ui.defaults.layout, ui.defaults.layout ]
      ],
      cache:  []
    }, 
    build: function (fn) {
      
      //  supports a callback
      
      $.each(ui.rows.coords, function (i, coord) {
        $.each(coord, function (x, xywh) {
          ui.rows.cache.push(
            $canvas.rect.apply($canvas, this).attr(ui.rows.attrs[i][x])
          );
        });
      });
    }
  });
  
  //ui.build(function () {
  //});  
    
  var 
  onmove = function (dx, dy) {
                    
    //  MOVED VIA AN ANIMATION?
    var animated  = false, 
        organism  = geniVerse.organisms[ $(this.node).attr('data-organism-key') ], 
        setId     = $(this.node).attr('data-allele-set'), 
        setIndex  = $(this.node).attr('data-allele-set-index'), 
        tag       = organism.tags[setId][setIndex], 
        label     = organism.labels[setId][setIndex];
    
    if ( arguments[2] && typeof arguments[2] === 'boolean' ) {
      animated  = true;
    }
    
    this.attr({
      cx: animated ? dx : this.ox + dx, 
      cy: animated ? dy : this.oy + dy
    });

    //  FIX TO ONLY MOVE THIS CHROMOSOME'S CONNECTIONS        
    for (var i = organism.connections.length; i--;) {
      $canvas.connection(organism.connections[i]);
    }

    tag.attr({
      x: ( animated ? dx : this.ox + dx ) + 6, 
      y: ( animated ? dy : this.oy + dy ) - 13      
    }).toFront().show();
    label.attr({
      x: ( animated ? dx : this.ox + dx ) + 16, 
      y: ( animated ? dy : this.oy + dy ) - 4     
    }).toFront().show();
    
    //  NOOP HOOK        
    
    $canvas.safari();
  },
  onstart = function () {

    this.ox = this.attr('cx');
    this.oy = this.attr('cy');
    this.animate({  
      'fill-opacity': .2,
      'stroke-opacity': .2
    }, 500);

    //  NOOP HOOK    
  },  
  onend   = function () {
    
    var
      organism  = geniVerse.organisms[ $(this.node).attr('data-organism-key') ],  
      setId     = $(this.node).attr('data-allele-set'), 
      setIndex  = $(this.node).attr('data-allele-set-index'), 
      tag       = organism.tags[setId][setIndex], 
      label     = organism.labels[setId][setIndex];
   
    this.ox = this.attr('cx');
    this.oy = this.attr('cy');
    this.animate({  
      'fill-opacity': 1,
      'stroke-opacity': 1
    }, 500);  
    
    //  NOOP HOOK    
  };

    
  var geniVerse = {
    colors:   ['red', 'blue'],//[ Raphael.getColor(.9), Raphael.getColor(.9) ],
    ui:       {
      rows: {
        height: 320
      }
    
    },
    startAt:  {
      x: 60,
      y: 100,
      nextX: 20,
      nextY: 20,  //  10
      organismX: 25,
      organismY: 25,    
      atX: 0,
      atY: 0        
    },    
    currently: '',
    
    //  basic organism request, will call API, stubbed with organism.json
    request: function ( params, fn) {
      $.getJSON('organism.json', params, function (data) {
        fn.call(this, data);
      });    
    },
    //  organism default structure
    organism:   {
      
      fn:             $.noop,
      data:           {},
      alleles:        [],
      chromosomes:    [],
      tags:           [],
      labels:         [],      
      connections:    [],
      cLength:        0,
      cLengthCounter: 0,
      ready:          false
    
    },
    //  organism storage
    organisms:  {},
    
    //  parent organism default structure
    parent:     {
      cell:  [],
      contributes: []
    },
    //  parent organism storage
    parents:    {
      1:  {},
      2:  {}
    },
    
    renders: {
      
      chromosomes: function (set) {

        var _organism     = geniVerse.organisms[geniVerse.currently],
            _alleles      = _organism.alleles, 
            _chromosomes  = _organism.chromosomes,
            _tags         = _organism.tags,
            _labels       = _organism.labels,
            _connections  = _organism.connections,
            _color        = geniVerse.colors[set%2];

        //  DRAW CHROMOSOME STRANDS FOR ALLELES
        for ( var x = 0; x < _alleles[set].length - 1; x++) {

          //  IF A CHROMOSOME HAS ALREADY BEEN DRAWN IN THIS SET
          //  PRESERVER IT'S COLOR
          if ( _chromosomes[set] && _chromosomes[set][x] ) {
            _color = _chromosomes[set][x].bg.attr('stroke');
          }
          
          //  DRAW NEW CONNECTION PATH
          var connectionPath  = $canvas.connection(_alleles[set][x], _alleles[set][x+1], _color, _color + '|1');

          $(connectionPath.line.node).attr('data-allele-set', set);
          $(connectionPath.line.node).attr('data-allele-set-index', x);
          
          connectionPath.line
            .attr({ 
              cursor: 'move', 
              'stroke-width': 2
            })
            .mousedown(function (e) {
              ////console.log(e);
              
              //  TODO: ABSRACT OUT - THIS SHOULD BE REUSABLE
              
              var setIndex  = $(this.node).attr('data-allele-set');
              $.each(_tags[setIndex].slice(1, _tags[setIndex].length - 1), function(i, tag) {
                
//                //console.log(tag.attr());
                tag.toFront().show();                
              });
              $.each(_labels[setIndex].slice(1, _labels[setIndex].length - 1), function(i, label) {
                label.toFront().show();
              });
            })
            .mouseup(function (e) {
              ////console.log(e);
              /*
              var setIndex  = $(this.node).attr('data-allele-set');
              $.each(_tags[setIndex], function(i, tag) {
                tag.hide();                
              });
              $.each(_labels[setIndex], function(i, label) {
                label.hide();
              });
              */
            })
            .drag(
              //  onmove
              function (dx, dy) {
                
                
                var setIndex = $(this.node).attr('data-allele-set');
                
                //  UPDATE ALLELE POSITION
                $.each(_alleles[setIndex], function (i, allele) {
                  this.attr({
                    cx: this.ox + dx, 
                    cy: this.oy + dy
                  });          

                });
                
                
                $.each(_tags[setIndex].slice(1, _tags[setIndex].length - 1), function(i, tag) {
                
                  ////console.log(_alleles[setIndex][i]);
                  this.attr({
                    x: this.ox + dx, 
                    y: this.oy + dy
                  });                  
                });
                $.each(_labels[setIndex].slice(1, _labels[setIndex].length - 1), function(i, label) {
                  this.attr({
                    x: this.ox + dx, 
                    y: this.oy + dy
                  });      
                });                
                
                //  ENFORCE `integer` TYPE ON `setIndex`
                geniVerse.renders.chromosomes(+setIndex);
              },
              //  onstart
              function () {
                
                var setIndex = $(this.node).attr('data-allele-set');
                
                
                //  RECORD ALLELE CURRENT POSITION
                $.each(_alleles[setIndex], function (i, allele) {
                  this.ox = this.attr('cx'); 
                  this.oy = this.attr('cy');
                }); 
                $.each(_tags[setIndex].slice(1, _tags[setIndex].length - 1), function(i, tag) {
                  this.ox = this.attr('x'); 
                  this.oy = this.attr('y');                
                });
                $.each(_labels[setIndex].slice(1, _labels[setIndex].length - 1), function(i, label) {
                  this.ox = this.attr('x'); 
                  this.oy = this.attr('y');  
                });          
                
                //  NOOP HOOK             
              },    
              //  onend
              function () {
              
              
              //  NOOP HOOK
              }    
            );
          
          //  IF A CHROMOSOME HAS ALREADY BEEN DRAWN IN THIS SET
          if ( _chromosomes[set] && _chromosomes[set][x] ) {
            
            //  REMOVE SVG NODES FROM CANVAS
            $(_chromosomes[set][x].bg.node).remove();
            $(_chromosomes[set][x].line.node).remove();      
            
            //  ASSIGN NEW `connectionPath` TO EXISTING CHROMOSOME SET AT `x`
            _connections[(set + x + set)] = _chromosomes[set][x] = connectionPath;
          }
          //  OR IS NEW CHROMOSOME
          else {
            _connections.push(connectionPath);
            _chromosomes[set].push(connectionPath);
          }      
          
        }      
        
        
        var exists  = function () {

          if ( _chromosomes[(_chromosomes.length - 1)].length ) {
            
            if ( _organism.cLength === 0 ) {
              _organism.cLength = _organism.chromosomes.length;
            }
            
            //console.log(_organism.cLength);
            
            _organism.cLengthCounter++;
            
            
            //console.log(_organism.cLengthCounter);
              
            if ( _organism.cLengthCounter <= _organism.cLength ) {
              geniVerse.organisms[geniVerse.currently].fn.call(this, geniVerse.currently);
            }
            
            
            return;
          }
          setTimeout(function () {
            exists();
          }, 13);
        };        

        exists();
      
      },
      alleles: function () {
        
        var _alleles  = geniVerse.organisms[geniVerse.currently].alleles, 
            _color, _dummies = [0, _alleles.length - 1];

        for (var i = 0; i < _alleles.length; i++) {
          _color      = geniVerse.colors[i%2];
        
          for ( var x = 0; x < _alleles[i].length; x++) {
            
            if ( _dummies.indexOf(x) >= -1 ) {
              console.log(_color);
              
              _alleles[i][x]
                .attr({fill: _color,'stroke': _color, cursor: 'move'});
                
            } else {
              _alleles[i][x]
                .attr({fill: _color,'stroke': _color, 'fill-opacity': 1, 'stroke-width': 1, cursor: 'move'});


                //  disables drag support
                //.drag(onmove, onstart, onend);
            }
            
            
            
            $(_alleles[i][x].node).attr({
              'data-organism-key'     : geniVerse.currently, 
              'data-allele-set'       : i,
              'data-allele-set-index' : x
            });
          }      
          
          geniVerse.renders.chromosomes(i);
        }        
      
      }, 
      organisms: function (data, fn) {
        
        var _organism = $.extend({}, geniVerse.organism, {
          fn:   fn,
          data: data
        }), 
        _organismCell = [], 
        _cellTotal    = data.chromosomes.length/2,
        _cellCount    = 0
        ;
        
        geniVerse.currently = data.alleles+'-'+data.name;
        geniVerse.organisms[geniVerse.currently]   = _organism;
        
        $.each(data.chromosomes, function (i, chromosome) {
          
          
          
          
          var _alleleSet  = [], 
              _tagSet     = [],
              _labelSet   = [],
              _alleleAt   = $.extend({}, geniVerse.startAt), 
              isFirst     = !(i % 2) ? true : false,
              isEven      = $.isEven(i),
              topOffset   = 0,
              dummies     = [0];
          
          if ($.isEven(i+1)) {
            _cellCount++;
          }
   
          _alleleAt.atX += _alleleAt.x + (_alleleAt.nextX * i);
          _alleleAt.atX += isFirst ? _alleleAt.organismX : ( _alleleAt.nextX * 2 );
          
          
          var atX = _alleleAt.atX;
          
          //THIS IS BAD. FIX! FIX! FIX!       
          if ( i == 2 || i == 3  ) {
            topOffset = geniVerse.startAt.organismY * 3;//100
            atX -=25;
          }
          
          
          
          
          // ADD DUMMYS
          chromosome.alleles.unshift(chromosome.alleles[0]);
          chromosome.alleles.push(chromosome.alleles[0]);
          
          dummies.push(chromosome.alleles.length - 1);
          
          
          
          $.each(chromosome.alleles, function (x, allele) {
            
            _alleleAt.atY   = _alleleAt.y + (_alleleAt.nextY * x) + topOffset;
            

            var 
            diploid = chromosome.alleles[x], 
            label   = dummies.indexOf(x) > -1 ? '' : diploid.allele; //diploid.gene + ': ' + diploid.allele,
            
            var
            $tag    = dummies.indexOf(x) > -1 ? {} : $canvas.rect(atX + 4,   _alleleAt.atY - 10, 16, 16, 5)
                      .attr({fill: '#000', stroke: '#474747', 
                            'stroke-width': 1, 'stroke-opacity': .5,'fill-opacity': .2});
            
            var
            $label  = dummies.indexOf(x) > -1 ? {} : $canvas.text(atX + 12,  _alleleAt.atY - 2, label)
                                    .attr(ui.defaults.label);
                                    
            
                    
            //$droptag  = $canvas.g.drop(atX + 6,   _alleleAt.atY - 13,label);

            _alleleSet.push(
              $canvas
                .circle(atX + (isEven ? 24 : 0), _alleleAt.atY,  1)
                .hover(
                    function (event) {
                    //$tag.toFront().show();                      
                    //$label.toFront().show();
                  }, 
                  function (event) {
                    //$label.hide().toBack();                          
                    //$tag.hide();                          
                  }
                )
                .mousedown(function () {
                  

                  $tag.show().toFront();
                  $label.show().toFront();                
                })
            );
            
            
            // hide dummies behind chomosome strands
            if ( dummies.indexOf(x) > -1 ) {
              _alleleSet[x].insertAfter($stage);
            }              
            
            
            $(_alleleSet[(_alleleSet.length-1)].node).attr({
              'data-gene'   : diploid.gene,
              'data-allele' : diploid.allele,              
            });
                        
            _tagSet.push($tag);
            _labelSet.push($label);
          });
          
          //  ADD TO ALLELES 
          geniVerse.organisms[geniVerse.currently].alleles.push(_alleleSet);

          //  ADD TO TAGS
          geniVerse.organisms[geniVerse.currently].tags.push(_tagSet);          
          
          //  ADD TO LABELS
          geniVerse.organisms[geniVerse.currently].labels.push(_labelSet);
                    
          //  ADD EMPTY CHROMOSOME ARRAY AS HOLDER FOR THIS ALLELE SET
          geniVerse.organisms[geniVerse.currently].chromosomes.push([]);          
        });
        
        setTimeout(function () {
          geniVerse.renders.exists(data);
        }, 13);       
      
      },
      exists: function (data) {
        if ( geniVerse.organisms[geniVerse.currently].alleles.length === data.chromosomes.length ) {
          
          geniVerse.renders.alleles();       
          return;
        }
        setTimeout(function () {
          geniVerse.renders.exists(data);
        }, 13);      
      }
    }, 
    animate: {
      
      step: function (frameInt, svg, frames, step) {
        /*

        change to OBJECT

        {
        svg:          element,
        frames:       number to repeat,
        translation:  [x,y]


        // memoize??
        step:   the current frame frameInt
        }
        */
        //console.log(frameInt);
        //console.log(frameInt%2===1);
        svg.animate({
          // JUST TEST ANIMATION INFO
          translation:  ( frameInt == 0  ? '-' +step+ ' 0' : (  frameInt%2===1 ? step +' 0' : '-'+step+' 0'  ) )

        }, 25, function (e) {

          if ( step < frames ) {
          
            step++;
            
            
            onmove.call(this, this.attr('cx'), this.attr('cy'), true);
            onstart.call(this);
            onend.call(this);
            
            geniVerse.animate.step(frameInt, svg, frames, step);
            
            return true;
          }
          
          onmove.call(this, this.attr('cx'), this.attr('cy'), true);
          onstart.call(this);
          onend.call(this);
        });       
      
      }
    
    },    
    render: function ( params, fn ) {
      
      //  SET Y POSITION GLOBALS
      geniVerse.startAt.y     += geniVerse.ui.rows.height;    
      
    
      geniVerse.request(  params, function (data) {
        geniVerse.renders.organisms(data, function (name) {
          
          //if ( fn && $.isFunction(fn) ) {
            
            fn && $.isFunction(fn) && fn(geniVerse.organisms[name]);
          
          //}          
          
        });
      });    
    }
  };
 

  
  /*
  ---------------------------------------
  
  SAMPLE ORGANISM BUILDER
  
  ---------------------------------------
  */

  geniVerse.render(/* args for organism request */ {}, function (organism) {
    
    //console.log(organism);
    //testAnimation();  
    
    
    scaletest();
  });
  
  
  function scaletest() {
  
  
    var organisms  = geniVerse.organisms;
    
    $.each(organisms, function (i, organism) {

      $.each(organism.alleles, function (i, shapes) {
        for ( var x = 1; x < shapes.length-1; x++ ) {
          
          console.log(shapes[x].scale(8, 8).attr({
            
          }));
          
          //cx: 109.5
          //cy: 440.5
          
          //console.log(organism.tags[i][x].scale(8,8));
          //console.log(organism.labels[i][x].scale(8,8));
          
          //console.log(organism.chromosomes[i][x]);
        }      
      });
      
      
    });
  }

  //  CONCEPTUAL ANIMATION 
  function testAnimation() {
    
    var organisms  = geniVerse.organisms;
    
    $.each(organisms, function (i, organism) {
      $.each(organism.alleles, function (i, shapes) {
        //console.log(i);
        //console.log(shapes);
        for ( var x = 1; x < shapes.length-1; x++ ) {
          var frames = 2;
          geniVerse.animate.step(x, shapes[x], frames, 0);
        }      
      });      
    });
  }



  window.G  = geniVerse;
});

