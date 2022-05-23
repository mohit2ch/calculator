import "./styles.css";
import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-opertion",
  CLEAR: "clear",
  DEL: "delete",
  EVAL: "evaluate"
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          nextOperand: payload.digit,
          overwrite: false
        };
      }
      if (payload.digit === "0" && state.nextOperand === "0") return state;
      if (
        state.nextOperand &&
        payload.digit === "." &&
        state.nextOperand.includes(".")
      )
        return state;
      return {
        ...state,
        nextOperand: `${state.nextOperand || ""}${payload.digit}`
      };
    case ACTIONS.CLEAR:
      return {
        ...state,
        prevOperand: null,
        operation: null,
        nextOperand: null
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.nextOperand == null)
        return { ...state, operation: payload.operation };
      if (!state.prevOperand && !state.nextOperand) return state;
      // console.log(typeof state.prevOperand);
      if (!state.prevOperand) {
        return {
          ...state,
          prevOperand: state.nextOperand,
          operation: payload.operation,
          nextOperand: null
        };
      }
      return {
        ...state,
        prevOperand: evaluate(state),
        operation: payload.operation,
        nextOperand: null
      };
    case ACTIONS.EVAL:
      if (
        state.operation == null ||
        state.prevOperand == null ||
        state.nextOperand == null
      )
        return state;
      return {
        ...state,
        prevOperand: null,
        operation: null,
        nextOperand: evaluate(state),
        overwrite: true
      };
    case ACTIONS.DEL:
      if (state.overwrite) {
        return {
          ...state,
          prevOperand: null,
          operation: null,
          nextOperand: null,
          overwrite: false
        };
      }
      if (state.nextOperand == null) return state;
      let str = state.nextOperand;
      str = str.slice(0, -1);
      return { ...state, nextOperand: str };
    default:
  }
}

function evaluate(state) {
  const a = parseFloat(state.prevOperand);
  const b = parseFloat(state.nextOperand);
  if (isNaN(a) || isNaN(b)) {
    return "";
  }
  if (state.operation === "+") return a + b;
  if (state.operation === "-") return a - b;
  if (state.operation === "*") return a * b;
  if (state.operation === "/") return a / b;
}

export default function App() {
  const [{ prevOperand, operation, nextOperand }, dispatch] = useReducer(
    reducer,
    {
      prevOperand: null,
      operation: null,
      nextOperand: null
    }
  );

  return (
    <div className="calculatorGrid">
      <div className="output">
        <div className="prevOperand">
          {prevOperand} {operation}
        </div>
        <div className="nextOperand">{nextOperand}</div>
      </div>
      <button
        className="span2"
        onClick={() => {
          dispatch({ type: ACTIONS.CLEAR });
        }}
      >
        AC
      </button>
      <button
        onClick={() => {
          dispatch({ type: ACTIONS.DEL });
        }}
      >
        DEL
      </button>
      <OperationButton operation="/" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      {/* <button>*</button> */}
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      {/* <button>-</button> */}
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      {/* <button>+</button> */}
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span2"
        onClick={() => {
          dispatch({ type: ACTIONS.EVAL });
        }}
      >
        =
      </button>
    </div>
  );
}
