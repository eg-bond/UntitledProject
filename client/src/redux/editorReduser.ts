let initialState = {
  chapterIdGen: 0,
  pagesIdGen: 0,
  chapters: {
    ch1: {
      title: 'chapter1',
      pages: [
        { titile: 'titlep1', id: 'ch1_page0' },
        { titile: 'titlep2', id: 'ch1_page2' },
        { titile: 'titlep3', id: 'ch1_page6' },
      ],
    },
    ch2: {
      title: 'chapter2',
      pages: [
        { titile: 'asdf', id: 'ch2_page23' },
        { titile: 'titlep2', id: 'ch2_page11' },
      ],
    },
    ch3: {
      title: 'chapter3',
      pages: [
        { titile: 'aaaaaaaaa', id: 'ch3_page13' },
        { titile: 'titlep233', id: 'ch3_page111' },
      ],
    },
  },
  ch1_page0: {
    content: {},
  },
  ch2_page11: {
    content: {},
  },
  currentChapter: null,
  currentPage: null,
}
