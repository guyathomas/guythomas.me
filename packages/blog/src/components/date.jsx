import { parseISO, format } from "date-fns";
export default function Date(_a) {
    var dateString = _a.dateString;
    var date = parseISO(dateString);
    return <time dateTime={dateString}>{format(date, "LLLL d, yyyy")}</time>;
}
