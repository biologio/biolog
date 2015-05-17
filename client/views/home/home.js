Template.home.rendered = function(){
    var content = [
      { title: 'Andorra' },
      { title: 'United Arab Emirates' },
      { title: 'Afghanistan' },
      { title: 'Antigua' },
      { title: 'Anguilla' },
      { title: 'Albania' },
      { title: 'Armenia' },
      { title: 'Netherlands Antilles' },
      { title: 'Angola' },
      { title: 'Argentina' },
      { title: 'American Samoa' },
      { title: 'Austria' },
      { title: 'Australia' },
      { title: 'Aruba' },
      { title: 'Aland Islands' },
      { title: 'Azerbaijan' },
      { title: 'Bosnia' },
      { title: 'Barbados' },
      { title: 'Bangladesh' },
      { title: 'Belgium' },
      { title: 'Burkina Faso' },
      { title: 'Bulgaria' },
      { title: 'Bahrain' },
      { title: 'Burundi' }
      // etc
    ];
    $('.ui.search').search({
        source: content
    });
    
}