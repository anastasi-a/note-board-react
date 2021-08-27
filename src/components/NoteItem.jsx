import {useState, useEffect} from "react";

const NoteItem = (props) => {
  const [value, setValue] = useState("");

  const style = {
    top: `${props.item.position.top}px`,
    left: `${props.item.position.left}px`,
  }

  useEffect(() => {
    setValue(props.item.text);
  }, []);

  function onBlurInput() {
    props.onBlur({
      ...props.item,
      text: value,
      editMode: false
    });
  }

  function onKeyPress(e) {
    if (e.key === 'Enter' && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      props.onBlur({
        ...props.item,
        text: value,
        editMode: false
      });
    }
  }

  function autosizeTextarea(e) {
    setTimeout(() => {
      e.target.style.cssText = 'height:auto; padding:0';
      e.target.style.cssText = 'height:' + e.target.scrollHeight + 'px';
    },0);
  }

  return (
    <li id={props.item.id}
        className={!props.item.id ? "new-note" : ""}
        style={style}
    >
      {
        props.item.editMode ?
          <textarea value={value}
                    autoFocus={true}
                    maxLength={100}
                    onChange={(e) => setValue(e.target.value)}
                    onFocus={autosizeTextarea}
                    onKeyDown={autosizeTextarea}
                    onBlur={onBlurInput}
                    onKeyPress={onKeyPress}
          /> :
          <div className="note-wrapper">
            <div
              className="note-text"
              onClick={() => props.onClick(props.item.id, true)}>
              {props.item.text}
            </div>
            <button
              className="delete-button"
              type="button"
              onClick={() => props.onDeleteBtnClick(props.item.id)}
            >
              ✗
            </button>
          </div>
      }
    </li>
  );
}

export default NoteItem;

