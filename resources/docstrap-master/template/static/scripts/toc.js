(function ($) {

  $.create = function (elm) {
    return $(document.createElement(elm));
  };

  $.toc = function (options) {

    console.log(options);

    var $search = $(options.search);
    var $destination = $(options.destination);
    var $targets = $(options.selector, $search);
    var n = 1;

    $targets.each(function (i, target) {
      var id = target.id;
      var textContent = target.textContent.trim();
      var $output = $.create('a');
      var $span = $.create('span');

      if (id) {
        console.log('Found', id);
      }

      if (!id) {
        id = target.id = options.prefix + (n++);
        console.log('Added', id);
      }

      if (!textContent) {
        console.warn('textContent is empty', id);

        return true; // continue
      }

      $span
        .text(textContent)
        .addClass(options.prefix + target.tagName.toLowerCase())
        .appendTo($output);

      $output
        .addClass(options.attrClass)
        .attr('href', '#' + id)
        .appendTo($destination);
    });

  };

})(jQuery);
