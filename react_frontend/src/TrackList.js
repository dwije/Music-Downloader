const TrackList = ({trackList}) => {
    return (
        <div>
            <ul className="list-group">
                {
                    trackList.map((track) => (
                        <li className="list-group-item d-flex align-items-start">{track}</li>
                    ))
                }
            </ul>
        </div>
    );
}
 
export default TrackList;