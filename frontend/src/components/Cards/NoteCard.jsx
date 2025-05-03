import { MdCreate, MdDelete } from "react-icons/md";
import moment from "moment";

export default function NoteCard({
  title,
  createdAtDate,
  updatedAtDate,
  status,
  content,
  tags,
  onEdit,
  onDelete,
}) {
  return (
    <div className="border rounded-lg p-4 bg-white hover:shadow-md transition-all ease-in-out duration-300">
      <div className="flex items-start justify-between">
        <div>
          <h6 className="text- font-medium">{title}</h6>
          <span className="text-sm text-slate-500">
            {moment(createdAtDate).format("D MMM YYYY")}
          </span>
        </div>
      </div>

      <p className="text-sm text-slate-700 mt-2 line-clamp-2">{content}</p>

      <div className="text-sm text-slate-500 mt-2">
        {tags.map((tag) => {
          return ` #${tag}`;
        })}
      </div>

      <div className="flex items-center justify-between mt-2">
        <span
          className={`${
            status === "completed"
              ? "bg-green-200 text-green-700"
              : "bg-yellow-200 text-yellow-700"
          } text-xs rounded px-2 py-1`}
        >
          {status === "completed"
            ? `Completed on ${moment(updatedAtDate).format("D MMM")}`
            : status}
        </span>

        <div className="flex items-center gap-2">
          <MdCreate
            className="icon-btn hover:text-green-600"
            onClick={onEdit}
          />

          <MdDelete
            className="icon-btn hover:text-red-600"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
}
