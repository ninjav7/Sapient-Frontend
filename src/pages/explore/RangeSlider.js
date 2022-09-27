import * as React from 'react';
import { Range, getTrackBackground } from 'react-range';

const STEP = 0.01;
const COLORS = ['#0C2960', '#276EF1', '#9CBCF8', '#9CBCF9', '#ccc'];

class RangeSlider extends React.Component {
  state = {
    values: this.props.range,
  };

  handleSelection =(values)=>{
    this.setState({ values })
    this.props.onSelectionChange(values);
  }
  render() {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom:"2rem"
        }}
      >
        <Range
          values={this.state.values}
          step={this.props.STEP}
          min={this.props.MIN}
          max={this.props.MAX}
          onChange={(values) => this.handleSelection(values)}
          renderTrack={({ props, children }) => (
            <div
              onMouseDown={props.onMouseDown}
              onTouchStart={props.onTouchStart}
              style={{
                ...props.style,
                height: '36px',
                display: 'flex',
                width: '100%',
              }}
            >
              <div
                ref={props.ref}
                style={{
                  height: '10px',
                  width: '100%',
                  borderRadius: '4px',
                  background: getTrackBackground({
                    values: this.state.values,
                    colors: COLORS,
                    min: this.props.MIN,
                    max: this.props.MAX,
                  }),
                  alignSelf: 'center',
                }}
              >
                {children}
              </div>
            </div>
          )}
          renderThumb={({ props, index, isDragged }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: '20px',
                width: '20px',
                borderRadius: '50%',
                backgroundColor: '#FFF',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0px 2px 6px #AAA',
                border : '1px solid #2955E7' 
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '28px',
                  color: '#000',
                  fontSize: '18px',
                  fontFamily: 'Arial,Helvetica Neue,Helvetica,sans-serif',
                  padding: '4px',
                  
                }}
              >
                {this.state.values[index]}
              </div>
              {/* <div
                style={{
                  height: '16px',
                  width: '5px',
                  backgroundColor: isDragged ? '#548BF4' : '#CCC',
                }}
              /> */}
            </div>
          )}
        />
        {/* <output style={{ marginTop: '30px' }}>
          {this.props.MIN +
            ' - ' +
            this.state.values.join(' - ') +
            ' - ' +
            this.props.MAX +
            '+'}
        </output> */}
      </div>
    );
  }
}

export default RangeSlider;
