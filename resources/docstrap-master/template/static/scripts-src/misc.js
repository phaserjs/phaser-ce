var _scrollSpyListGroup = {

  activate: function activate (target) {
    this.activeTarget = target;
    this.clear();

    var selector = this.selector + '[data-target="' + target + '"],' + this.selector + '[href="' + target + '"]';
    var active = $(selector).addClass('active');

    active.trigger('activate.bs.scrollspy');
  },

  clear: function clear () {
    $(this.selector).removeClass('active');
  },

};

jQuery(function ($) {
  var navbarHeight = $('.navbar').height();

  $.toc({
    attrClass: 'list-group-item',
    destination: '#toc-insert',
    prefix: 'toc-',
    search: '#main',
    selector: 'h1, h2, h3, h4'
  });

  holmes({
    find: '#toc a',
    input: '#toc-filter-input',
    placeholder: '<div class="alert alert-warning" role="alert">None match.</div>'
  })
    .start();

  $(window)
    .on('hashchange', function () {
      var hash = location.hash.slice(1);
      var elm = hash && document.getElementById(hash);

      if (hash && !elm) {
        console.warn('No such element: "%s"', hash);
      }

      if (elm) {
        window.scrollTo(0, elm.offsetTop - navbarHeight);
      }
    });

  $('.dropdown-toggle')
    .dropdown();

  $('table')
    .addClass('table');

  var $scrollElement = $('body').scrollspy({
    offset: navbarHeight,
    target: '#toc',
  });

  var scrollspy = $scrollElement.data('bs.scrollspy');

  scrollspy.selector = scrollspy.options.target + ' .list-group-item';
  Object.assign(scrollspy, _scrollSpyListGroup);
  scrollspy.refresh();

  console.log('offsets', scrollspy.offsets);
  console.log('targets', scrollspy.targets);
  console.log('scrollspy', scrollspy);
});
