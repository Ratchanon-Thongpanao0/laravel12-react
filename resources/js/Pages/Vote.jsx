import { useState } from "react";
import "../../css/vote.css";

export default function Vote() {

    const [votes, setVotes] = useState([0, 0, 0, 0, 0, 0]);

    const candidates = [
        { name: "ผู้สมัคร A", color: "blue" },
        { name: "ผู้สมัคร B", color: "green" },
        { name: "ผู้สมัคร C", color: "purple" },
        { name: "ผู้สมัคร D", color: "orange" },
        { name: "ผู้สมัคร E", color: "red" },
        { name: "ผู้สมัคร F", color: "teal" },
    ];

    const total = votes.reduce((sum, vote) => sum + vote, 0);

    const percent = (vote) => {
        if (total === 0) return 0;
        return ((vote / total) * 100).toFixed(1);
    };

    const handleVote = (index) => {
        const newVotes = [...votes];
        newVotes[index]++;
        setVotes(newVotes);
    };

    return (
        <div className="container">

            <h1 className="title">🗳 ระบบเก็บคะแนนการโหวต</h1>

            <div className="cards">

                {candidates.map((candidate, index) => (

                    <div className="card" key={index}>

                        <div className="avatar">👤</div>

                        <h2>{candidate.name}</h2>

                        <div className="score">
                            {votes[index]}
                        </div>

                        <p>คะแนน</p>

                        <button
                            className={`btn ${candidate.color}`}
                            onClick={() => handleVote(index)}
                        >
                            โหวต
                        </button>

                        <div className="progress">

                            <div
                                className={`fill ${candidate.color}-fill`}
                                style={{
                                    width: percent(votes[index]) + "%"
                                }}
                            ></div>

                        </div>

                        <div className="percent">
                            {percent(votes[index])}%
                        </div>

                    </div>

                ))}

            </div>

            <div className="summary">

                <h2>🏆 สรุปคะแนนรวม</h2>

                <div className="total">{total}</div>

                <table>

                    <thead>
                        <tr>
                            <th>ผู้สมัคร</th>
                            <th>คะแนน</th>
                            <th>เปอร์เซ็นต์</th>
                        </tr>
                    </thead>

                    <tbody>

                        {candidates.map((candidate, index) => (

                            <tr key={index}>

                                <td>{candidate.name}</td>

                                <td>{votes[index]}</td>

                                <td>{percent(votes[index])}%</td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}