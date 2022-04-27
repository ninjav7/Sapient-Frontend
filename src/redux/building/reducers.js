

const initalCounterState = { counter: 0 };
const counterReducer = (prevState = initalCounterState, action) => {
    switch (action.type) {
        case "ID":
          return { ID:action.by };
        default:
          return prevState;
      }
};

export default counterReducer;
