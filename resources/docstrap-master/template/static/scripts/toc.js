(function ($) {

  $.create = function (elm) {
    return $(document.createElement(elm));
  };

  var getSafeId = function (id) {
    return id.replace(/^\W+/i, '_');
  };

  $.toc = function (options) {

    console.log(options);

    var $search = $(options.search);
    var $destination = $(options.destination);
    var $targets = $(options.selector, $search);
    var n = 1;

    var createId = function () {
      return options.prefix + (n++);
    };

    $targets.each(function (i, target) {
      var id = target.id;
      var textContent = target.textContent.trim();

      if (!textContent) {
        console.warn('textContent is empty', id);
        return true; // continue
      }

      var $output = $.create('a');
      var $span = $.create('span');

      if (id) {
        console.log('Found', id);
      } else {
        id = target.id = createId();
        console.log('Added', id);
      }

      var safeId = getSafeId(id) || createId();

      if (id !== safeId) {
        $.create('a')
          .attr('id', safeId)
          .attr('data-for', id)
          .insertBefore(target);
        id = safeId;
        console.log('Inserted', safeId);
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
