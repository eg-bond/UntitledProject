let initialState = {
  chapterIdGen: 0,
  pagesIdGen: 0,
  currentChapter: null,
  currentPage: null,
  chapters: {
    ch1: {
      title: 'chapter1',
      pages: [
        { title: 'titlep1', id: 'ch1_page0' },
        { titie: 'titlep2', id: 'ch1_page2' },
        { title: 'titlep3', id: 'ch1_page6' },
      ],
    },
    ch2: {
      title: 'chapter2',
      pages: [
        { title: 'asdf', id: 'ch2_page23' },
        { title: 'titlep2', id: 'ch2_page11' },
      ],
    },
    ch3: {
      title: 'chapter3',
      pages: [
        { title: 'aaaaaaaaa', id: 'ch3_page13' },
        { title: 'titlep233', id: 'ch3_page111' },
      ],
    },
  },
  ch1_page0: {
    pageContent: [
      {
        elem: 'p',
        paragraphContent: [
          { value: 'some string ', bold: false, underline: false, ...props },
          { value: 'boldPart ', bold: true, underline: false, ...props },
          { value: 'underlinePart ', bold: false, underline: true, ...props },
          { value: 'normalStr ', bold: false, underline: false, ...props },
        ],
      },
      {
        elem: 'p',
        paragraphContent: [
          {
            value: 'absolutely another string ',
            bold: false,
            underline: false,
            ...props,
          },
          {
            value: 'for checking selection ',
            bold: true,
            underline: false,
            ...props,
          },
          { value: 'and somth ', bold: false, underline: true, ...props },
          { value: 'asdfsdaf', bold: false, underline: false, ...props },
        ],
      },
      // { elem: 'ul' },
      // {
      //   elem: 'p',
      //   value: [
      //     'some string ',
      //     '<b>boldPart</b> ',
      //     '<u>underlinePart</u>',
      //     ' normalStr',
      //   ],
      // },
    ],
  },
  ch2_page11: {
    content: {},
  },
}
