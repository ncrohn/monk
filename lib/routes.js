module.exports = function(app) {

  return {
    splash: function(req, res) {
      res.render('splash');
    },

    temp: function(req, res) {
      console.log(req);
      res.send(200);
    }
  };

};