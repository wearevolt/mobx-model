module.exports = function(target, options) {
  target.addClassAction('externalPluginClassAction', function() {
    return { basicClass: this, options };
  });

  target.addAction('externalPluginModelAction', function() {
    return { model: this, options };
  });
};
