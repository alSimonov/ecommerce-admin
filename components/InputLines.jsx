

export default function InputLines({values, setValues, typeValue1, typeValue2, placeholderValue1, placeholderValue2, textButton}) {
  function addProperty(){
    setValues(prev => {
      return [...prev, {value1:'', value2:''}];
    });
  }
  function handleValue1Change(index, newValue1){
    setValues(prev => {
      const properties = [...prev];
      properties[index].value1 = newValue1;
      return properties;
    });
  }
  function handleValue2Change(index, newValue2){
    setValues(prev => {
      const properties = [...prev];
      properties[index].value2 = newValue2;
      return properties;
    });
  }
  function removeProperty(indexToRemove){
    setValues(prev => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }
  return (
    <>
     <button 
        onClick={addProperty}
        type="button" 
        className="btn-default text-sm mb-2" 
      >
        {textButton}
      </button>
      {values.length > 0 && values.map( (value, index) => (
        <div key={index} className="flex gap-1 mb-2">
          <input 
            type={typeValue1} 
            value={value.value1}
            className="mb-0" 
            onChange={ev => handleValue1Change(index, ev.target.value)}
            placeholder={placeholderValue1}
            />
          <input 
            type={typeValue2}  
            value={value.value2} 
            className="mb-0" 
            onChange={ev => handleValue2Change(index, ev.target.value)}
            placeholder={placeholderValue2}
            />
          <button 
            onClick={() => removeProperty(index)}
            type="button"
            className="btn-red">
            Удалить
            {/* Remove */}
          </button>
        </div>
      ))} 
    </>
  )
}