(function editor(parser) {
  var sourceFile = document.location.search.replace('?', '') || 'anagram.js';

  parser.load('js/lib/grammars/javascript.pegjs', function(instance) {
    $.get('data/' + sourceFile, function(code) {
      var moduleExpression = instance.parseModule(sourceFile, code);
      $.event.trigger('loadexpressions', [moduleExpression, $('.editor')[0]]);
    }, 'text');
  });

  $(document).on('editing', function(event, data) {
    $('.editing').blur();
    data.editing(true);
    var textBox = $('.editing');
    var symbol = textBox.parent();
    var width = symbol.outerWidth();
    var height = symbol.outerHeight();
    textBox.css({ top: 0, left: 0, width: width, height: height });
    textBox.focus();
  });

  $('.editor').on('doubletap', '.symbol, .literal', function(event, data) {
    $.event.trigger('edit', $(this)[0]);
  });

  $('.editor').on('focusout', '.editing', function() {
    ko.dataFor($(this)[0]).editing(false);
    $.event.trigger('domchanged');
  });

  $(document).keydown(function(e) {
    if (e.keyCode === 27 || e.keyCode === 13) {
      $('.editing').blur();
      $('.palette-menu').hide();
    }
  });

  $(document).on('click', function(event) {
    $('.palette-menu').hide();
  });

  $('.editor').on('click', '.collapse', function() {
    var collapsible = $(this).parent().children('.collapsible:first');
    collapsible.toggleClass('expanded', collapsible.hasClass('collapsed'));
    collapsible.toggleClass('collapsed', !collapsible.hasClass('collapsed'));
    $(this).toggleClass('expanded', $(this).hasClass('collapsed'));
    $(this).toggleClass('collapsed', !$(this).hasClass('collapsed'));
    collapsible.bind('transitionend', function() {
      $.event.trigger('layoutchanged');
      $(this).unbind('transitionend');
    });
  });

  (function() {
    var resizeAction;
    $(window).resize(function() {
      clearTimeout(resizeAction);
      resizeAction = setTimeout(resized, 100);
    });

    var resized = function() {
      $.event.trigger('layoutchanged');  
    };
  })();

  ko.applyBindings({ themes: ['gray','green','pink','heroku'] }, $('.themepick')[0]);

  $('.themepick').change(function() {
    var theme = $(this).val();
    var reload = '?reload=' + new Date().getTime();
    $('link[rel="stylesheet"]').each(function() {
      this.href = 'css/themes/' + theme + '.css' + reload;
    });
    $.getScript('lib/less-1.7.0.min.js' + reload);
  });
})(INDEX.parser);
