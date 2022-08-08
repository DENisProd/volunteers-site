import './text_field.css'

export default function TextField(props) {

    const input = props?.useInput

    return (
        <div className="field_container">
            <input className="form_input" onChange={e => input?.onChange(e)} onBlur={e => input?.onBlur(e)}
                   name={props.name} type={props?.type || "text"} placeholder={props.placeholder} value={input?.value} style={props.styles} min={props?.min} max={props?.max}/>
            {(input?.isDirty && (input?.isEmpty||input?.emailError||input?.minLengthError||input?.maxLengthError||input?.equalsError)) && <div className="error_field">{input?.message}</div>}
        </div>
    )
}