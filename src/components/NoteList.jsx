import NoteItem from "./NoteItem";

const NoteList = (props) => {
  return(
    <ul>
      {
        props.activeItem.editMode && !props.activeItem.id &&
          <NoteItem
            key={props.activeItem.id}
            item={props.activeItem}
            onClick={props.onItemClick}
            onBlur={props.onItemBlur}
          />
      }
      {
        props.items.map(
          item =>
            <NoteItem
              key={item.id}
              item={item}
              onClick={props.onItemClick}
              onBlur={props.onItemBlur}
              onDeleteBtnClick={props.onDeleteBtnClick}
            />
        )
      }
    </ul>
  )
}

export default NoteList;
