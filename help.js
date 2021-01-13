let data = $('#show-release-table > tr').get().map(tr => {
    return {
      title: $(tr).find('.episode-title').text(),
     
}});