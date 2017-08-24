$(function () {
  $('[id*="$"]')
    .each(function () {
      var $this = $(this);
      $this.attr('id', $this.attr('id').replace('$', '__'));
    });

  $.catchAnchorLinks({
    navbarOffset: 10
  });

  $('#toc')
    .toc({
      anchorName: function (i, heading, prefix) {
        return $(heading).attr('id') || (prefix + i);
      },
      selectors: '#toc-content h1, #toc-content h2, #toc-content h3, #toc-content h4',
      showAndHide: false,
      smoothScrolling: true
    });

  holmes({
    input: '#filter',
    find: '#toc a',
    placeholder: '<div class="alert alert-warning" role="alert">None match.</div>',
  })
    .start();

  $('#main span[id^=toc]')
    .addClass('toc-shim');

  $('.dropdown-toggle')
    .dropdown();

  $('table')
    .addClass('table');

});
