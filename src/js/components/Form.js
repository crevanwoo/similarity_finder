import React from 'react';
import { withRouter } from 'react-router';

const Form = ({text, pasteTextFromClipboard, handleChange, handleSubmit}) => (
    <form onSubmit={handleSubmit}>
        <textarea placeholder="Input text here" onChange={handleChange} value={text}></textarea>
        <div>
            <button type="button" onClick={pasteTextFromClipboard}>Paste from clipboard</button>
            <button type="submit">Submit</button>
        </div>
    </form>
);

export default withRouter(Form);
