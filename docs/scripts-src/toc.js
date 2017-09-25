(function ($) {

  var getSafeId = function (id) {
    return id.replace(/^\W+/i, '_');
  };

  var getExistingIds = function () {
    return $('[id]')
      .map(function (i, elm) {
        return elm.id;
      })
      .get()
      .sort();
  };

  var getExistingIdsMap = function () {
    var ids = getExistingIds();
    var map = {};

    for (var i = 0; i < ids.length; i++) {
      var id = ids[i];

      if (map[id]) {
        console.warn('Duplicate id:', id);
      } else {
        map[id] = true;
      }
    }

    return map;
  };

  $.create = function (elm) {
    return $(document.createElement(elm));
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

    getExistingIdsMap(); // as check

    $targets.each(function (i, target) {
      var id = target.id;
      var textContent = target.textContent.trim();

      if (!textContent) {
        console.warn('textContent is empty', id);
        return true; // continue
      }

      var name = target.getAttribute('data-name') || textContent;

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
        .text(name)
        .addClass(options.prefix + target.tagName.toLowerCase())
        .appendTo($output);

      $output
        .addClass(options.attrClass)
        .attr('href', '#' + id)
        .appendTo($destination);
    });

  };

})(jQuery);
