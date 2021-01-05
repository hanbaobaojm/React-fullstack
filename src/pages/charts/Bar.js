import React from 'react';
import { VictoryChart,VictoryBar,VictoryTheme} from "victory";
const Bar = () => {
    return(
        <VictoryChart
            theme={VictoryTheme.material}
        >
            <VictoryBar
                style={{ data: { fill: 'cornflowerblue' } }}
                alignment="start"
                data={[
                    { x: 1, y: 2 },
                    { x: 2, y: 3 },
                    { x: 3, y: 5 },
                    { x: 4, y: 4 },
                    { x: 5, y: 7 }
                ]}
            />
        </VictoryChart>
    )
}
export default Bar