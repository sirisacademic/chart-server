const express = require('express');
const vg = require('vega');

const app = express();


//vg.config.load.baseURL = 'https://vega.github.io/vega-editor/app/';

const TYPES = {
  VegaLite: require('./charts/VegaLite'),
  Bar: require('./charts/Bar'),
  DistrictBar: require('./charts/DistrictBar'),
  DemographicBar: require('./charts/DemographicBar'),
  ZurichMap: require('./charts/ZurichMap')
};


app.get('/:type', (request, response) => {
    /*
  if (!TYPES[request.params.type]) {
    return response.status(404).send('Not Found');
  }

  const spec = TYPES[request.params.type]({
    spec: JSON.parse(request.query.spec)
  });
  */

  var spec = JSON.parse(request.query.spec);

 var view = new vg.View(
     vg.parse(spec),
     {
         renderer: 'svg'
     }
    );

    // generate a static SVG image
    view.toSVG()
        .then(function(svg) {
        
            response
              .set('Cache-Control', `public, max-age=${60 * 60}`)
                .type('svg').send(svg);
          //view.destroy();
        })
        .catch(function(err) { console.error(err); });

});


app.get('/', (req, response) => {
    
    response.send('Hello world');
    return;
    
    var spec = {
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "description": "A basic bar chart example, with value labels shown upon mouse hover.",
        "width": 400,
        "height": 200,
        "padding": 5,
    
        "data": [
        {
            "name": "table",
            "values": [
            {"category": "A", "amount": 28},
            {"category": "B", "amount": 55},
            {"category": "C", "amount": 43},
            {"category": "D", "amount": 91},
            {"category": "E", "amount": 81},
            {"category": "F", "amount": 53},
            {"category": "G", "amount": 19},
            {"category": "H", "amount": 87}
            ]
        }
        ],
    
        "signals": [
        {
            "name": "tooltip",
            "value": {},
            "on": [
            {"events": "rect:mouseover", "update": "datum"},
            {"events": "rect:mouseout",  "update": "{}"}
            ]
        }
        ],
    
        "scales": [
        {
            "name": "xscale",
            "type": "band",
            "domain": {"data": "table", "field": "category"},
            "range": "width",
            "padding": 0.05,
            "round": true
        },
        {
            "name": "yscale",
            "domain": {"data": "table", "field": "amount"},
            "nice": true,
            "range": "height"
        }
        ],
    
        "axes": [
        { "orient": "bottom", "scale": "xscale" },
        { "orient": "left", "scale": "yscale" }
        ],
    
        "marks": [
        {
            "type": "rect",
            "from": {"data":"table"},
            "encode": {
            "enter": {
                "x": {"scale": "xscale", "field": "category"},
                "width": {"scale": "xscale", "band": 1},
                "y": {"scale": "yscale", "field": "amount"},
                "y2": {"scale": "yscale", "value": 0}
            },
            "update": {
                "fill": {"value": "steelblue"}
            },
            "hover": {
                "fill": {"value": "red"}
            }
            }
        },
        {
            "type": "text",
            "encode": {
            "enter": {
                "align": {"value": "center"},
                "baseline": {"value": "bottom"},
                "fill": {"value": "#333"}
            },
            "update": {
                "x": {"scale": "xscale", "signal": "tooltip.category", "band": 0.5},
                "y": {"scale": "yscale", "signal": "tooltip.amount", "offset": -2},
                "text": {"signal": "tooltip.amount"},
                "fillOpacity": [
                {"test": "datum === tooltip", "value": 0},
                {"value": 1}
                ]
            }
            }
        }
        ]
    };

    var view = new vg.View(
        vg.parse(spec),
        {
            renderer: 'svg'
        }
    );
 
    // generate a static SVG image
    view.toSVG()
        .then(function(svg) {
        
            response
            .set('Cache-Control', `public, max-age=${60 * 60}`)
                .type('svg').send(svg);
        })
        .catch(function(err) { console.error(err); });
});

const PORT = process.env.PORT || 3000
var server = app.listen(PORT, function () {

    var host = server.address().address;
    var port = server.address().port;
  
    console.log('Example app listening at http://%s:%s', host, port);
  });