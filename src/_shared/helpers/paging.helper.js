
module.exports = (pageOffSet, pageLimit, totalItems) => {
  let pages = parseInt(totalItems / pageLimit, 10);

  if ((totalItems % 2) > 0) {
    pages += 1;
  }

  if (pages === 0) {
    pages = 1;
  }

  const page = parseInt(pageOffSet, 10) + 1;
  const previous = pageOffSet > 0;
  const next = totalItems > (page * totalItems);

  return {
    currentPage: page,
    itemsPerPage: pageLimit,
    next,
    previous,
    pages,
    offset: page - 1,
    totalItems
  };

};
