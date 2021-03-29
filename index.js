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


app.get('/', (req, res) => {

    res.send('hello world');
});

var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;
  
    console.log('Example app listening at http://%s:%s', host, port);
  });