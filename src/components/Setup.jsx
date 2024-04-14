import Header from './Header';
import { useState } from 'react';
import { useNavigate  } from 'react-router-dom';

const Setup = () => {
    const [inputs, setInputs] = useState({
        multiplication: false, // defaults to checked
        addition: false,
        subtraction: false,
        multiplication_1x1: false,
        multiplication_1x2: false,
        multiplication_1x3: false,
        multiplication_1x4: false,
        multiplication_2x2: false,
        multiplication_2x3: false,
        multiplication_2x4: false,
        multiplication_3x3: false,
        multiplication_3x4: false,
        multiplication_4x4: false,
        multiplication_1x1: false,
        addition_1x1: false,
        addition_1x2: false,
        addition_1x3: false,
        addition_1x4: false,
        addition_2x2: false,
        addition_2x3: false,
        addition_2x4: false,
        addition_3x3: false,
        addition_3x4: false,
        addition_4x4: false,
        subtraction_1x1: false,
        subtraction_1x2: false,
        subtraction_1x3: false,
        subtraction_1x4: false,
        subtraction_2x2: false,
        subtraction_2x3: false,
        subtraction_2x4: false,
        subtraction_3x3: false,
        subtraction_3x4: false,
        subtraction_4x4: false,
        repeat_incorrect_questions: false,
    });
    const navigate = useNavigate();

    const handleChange = (event) => {
        const name = event.target.name;
        const isChecked = event.target.checked;
        setInputs(values => ({...values, [name]: isChecked}));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const selectedInputs = {};
        Object.keys(inputs).map((input) => {
            if (inputs[input]) {
                selectedInputs[input] = true;
            }
        });
        const queryParams = new URLSearchParams(selectedInputs).toString();
        navigate(`/play?${queryParams}`);
    }

    return (
        <div>
            <Header />
            <div className="container">
                <h1 className="display-2">Mental Maths</h1>
                <div className="js-pre-start mb-5">
                    <form action="game/index.html" method="get" onSubmit={handleSubmit}>
                        <fieldset className="start-form__fieldset">
                            <legend className="heading-2">Question types</legend>
                            <div>
                                <input type="checkbox" name="multiplication" id="multiplication" value={inputs.multiplication} onChange={handleChange} checked={inputs.multiplication}></input>
                                <label htmlFor="multiplication">Multiplication</label>
                                <fieldset className="type-subset" disabled={!inputs.multiplication}>
                                    <legend className="heading-3">Number of digits</legend>
                                    <div>
                                        <div>
                                            <input type="checkbox" name="multiplication_1x1" id="multiplication_1x1" value={inputs.multiplication_1x1} onChange={handleChange} checked={inputs.multiplication_1x1}></input>
                                            <label htmlFor="multiplication_1x1">1 by 1</label>
                                            <input type="checkbox" name="multiplication_1x2" id="multiplication_1x2" value={inputs.multiplication_1x2} onChange={handleChange} checked={inputs.multiplication_1x2}></input>
                                            <label htmlFor="multiplication_1x2">1 by 2</label>
                                            <input type="checkbox" name="multiplication_1x3" id="multiplication_1x3" value={inputs.multiplication_1x3} onChange={handleChange} checked={inputs.multiplication_1x3}></input>
                                            <label htmlFor="multiplication_1x3">1 by 3</label>
                                            <input type="checkbox" name="multiplication_1x4" id="multiplication_1x4" value={inputs.multiplication_1x4} onChange={handleChange} checked={inputs.multiplication_1x4}></input>
                                            <label htmlFor="multiplication_1x4">1 by 4</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" name="multiplication_2x2" id="multiplication_2x2" value={inputs.multiplication_2x2} onChange={handleChange} checked={inputs.multiplication_2x2}></input>
                                            <label htmlFor="multiplication_2x2">2 by 2</label>
                                            <input type="checkbox" name="multiplication_2x3" id="multiplication_2x3" value={inputs.multiplication_2x3} onChange={handleChange} checked={inputs.multiplication_2x3}></input>
                                            <label htmlFor="multiplication_2x3">2 by 3</label>
                                            <input type="checkbox" name="multiplication_2x4" id="multiplication_2x4" value={inputs.multiplication_2x4} onChange={handleChange} checked={inputs.multiplication_2x4}></input>
                                            <label htmlFor="multiplication_2x4">2 by 4</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" name="multiplication_3x3" id="multiplication_3x3" value={inputs.multiplication_3x3} onChange={handleChange} checked={inputs.multiplication_3x3}></input>
                                            <label htmlFor="multiplication_3x3">3 by 3</label>
                                            <input type="checkbox" name="multiplication_3x4" id="multiplication_3x4" value={inputs.multiplication_3x4} onChange={handleChange} checked={inputs.multiplication_3x4}></input>
                                            <label htmlFor="multiplication_3x4">3 by 4</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" name="multiplication_4x4" id="multiplication_4x4" value={inputs.multiplication_4x4} onChange={handleChange} checked={inputs.multiplication_4x4}></input>
                                            <label htmlFor="multiplication_4x4">4 by 4</label>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                            <div>
                                <input type="checkbox" name="addition" id="addition" value={inputs.addition} onChange={handleChange} checked={inputs.addition}></input>
                                <label htmlFor="addition">Addition</label>
                                <fieldset className="type-subset" disabled={!inputs.addition}>
                                    <legend className="heading-3">Number of digits</legend>
                                    <div>
                                        <div>
                                            <input type="checkbox" name="addition_1x1" id="addition_1x1" value={inputs.addition_1x1} onChange={handleChange} checked={inputs.addition_1x1}></input>
                                            <label htmlFor="addition_1x1">1 by 1</label>
                                            <input type="checkbox" name="addition_1x2" id="addition_1x2" value={inputs.addition_1x2} onChange={handleChange} checked={inputs.addition_1x2}></input>
                                            <label htmlFor="addition_1x2">1 by 2</label>
                                            <input type="checkbox" name="addition_1x3" id="addition_1x3" value={inputs.addition_1x3} onChange={handleChange} checked={inputs.addition_1x3}></input>
                                            <label htmlFor="addition_1x3">1 by 3</label>
                                            <input type="checkbox" name="addition_1x4" id="addition_1x4" value={inputs.addition_1x4} onChange={handleChange} checked={inputs.addition_1x4}></input>
                                            <label htmlFor="addition_1x4">1 by 4</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" name="addition_2x2" id="addition_2x2" value={inputs.addition_2x2} onChange={handleChange} checked={inputs.addition_2x2}></input>
                                            <label htmlFor="addition_2x2">2 by 2</label>
                                            <input type="checkbox" name="addition_2x3" id="addition_2x3" value={inputs.addition_2x3} onChange={handleChange} checked={inputs.addition_2x3}></input>
                                            <label htmlFor="addition_2x3">2 by 3</label>
                                            <input type="checkbox" name="addition_2x4" id="addition_2x4" value={inputs.addition_2x4} onChange={handleChange} checked={inputs.addition_2x4}></input>
                                            <label htmlFor="addition_2x4">2 by 4</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" name="addition_3x3" id="addition_3x3" value={inputs.addition_3x3} onChange={handleChange} checked={inputs.addition_3x3}></input>
                                            <label htmlFor="addition_3x3">3 by 3</label>
                                            <input type="checkbox" name="addition_3x4" id="addition_3x4" value={inputs.addition_3x4} onChange={handleChange} checked={inputs.addition_3x4}></input>
                                            <label htmlFor="addition_3x4">3 by 4</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" name="addition_4x4" id="addition_4x4" value={inputs.addition_4x4} onChange={handleChange} checked={inputs.addition_4x4}></input>
                                            <label htmlFor="addition_4x4">4 by 4</label>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                            <div>
                                <input type="checkbox" name="subtraction" id="subtraction" value={inputs.subtraction} onChange={handleChange} checked={inputs.subtraction}></input>
                                <label htmlFor="subtraction">Subtraction</label>
                                <fieldset className="type-subset" disabled={!inputs.subtraction}>
                                    <legend className="heading-3">Number of digits</legend>
                                    <div>
                                        <div>
                                            <input type="checkbox" name="subtraction_1x1" id="subtraction_1x1" value={inputs.subtraction_1x1} onChange={handleChange} checked={inputs.subtraction_1x1}></input>
                                            <label htmlFor="subtraction_1x1">1 by 1</label>
                                            <input type="checkbox" name="subtraction_1x2" id="subtraction_1x2" value={inputs.subtraction_1x2} onChange={handleChange} checked={inputs.subtraction_1x2}></input>
                                            <label htmlFor="subtraction_1x2">1 by 2</label>
                                            <input type="checkbox" name="subtraction_1x3" id="subtraction_1x3" value={inputs.subtraction_1x3} onChange={handleChange} checked={inputs.subtraction_1x3}></input>
                                            <label htmlFor="subtraction_1x3">1 by 3</label>
                                            <input type="checkbox" name="subtraction_1x4" id="subtraction_1x4" value={inputs.subtraction_1x4} onChange={handleChange} checked={inputs.subtraction_1x4}></input>
                                            <label htmlFor="subtraction_1x4">1 by 4</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" name="subtraction_2x2" id="subtraction_2x2" value={inputs.subtraction_2x2} onChange={handleChange} checked={inputs.subtraction_2x2}></input>
                                            <label htmlFor="subtraction_2x2">2 by 2</label>
                                            <input type="checkbox" name="subtraction_2x3" id="subtraction_2x3" value={inputs.subtraction_2x3} onChange={handleChange} checked={inputs.subtraction_2x3}></input>
                                            <label htmlFor="subtraction_2x3">2 by 3</label>
                                            <input type="checkbox" name="subtraction_2x4" id="subtraction_2x4" value={inputs.subtraction_2x4} onChange={handleChange} checked={inputs.subtraction_2x4}></input>
                                            <label htmlFor="subtraction_2x4">2 by 4</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" name="subtraction_3x3" id="subtraction_3x3" value={inputs.subtraction_3x3} onChange={handleChange} checked={inputs.subtraction_3x3}></input>
                                            <label htmlFor="subtraction_3x3">3 by 3</label>
                                            <input type="checkbox" name="subtraction_3x4" id="subtraction_3x4" value={inputs.subtraction_3x4} onChange={handleChange} checked={inputs.subtraction_3x4}></input>
                                            <label htmlFor="subtraction_3x4">3 by 4</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" name="subtraction_4x4" id="subtraction_4x4" value={inputs.subtraction_4x4} onChange={handleChange} checked={inputs.subtraction_4x4}></input>
                                            <label htmlFor="subtraction_4x4">4 by 4</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" name="include_negatives" id="subtraction_include_negatives"></input>
                                            <label htmlFor="subtraction_include_negatives">Include questions with negative results</label>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </fieldset>
                        <fieldset>
                            <input type="checkbox" name="repeat_incorrect_questions" id="repeat_incorrect_questions" value={inputs.repeat_incorrect_questions} onChange={handleChange} checked={inputs.repeat_incorrect_questions}></input>
                            <label htmlFor="repeat_incorrect_questions">Repeat incorrectly answered questions</label>
                        </fieldset>
                        <input type="submit" value="Start" className="btn btn-primary btn-lg mt-3"></input>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Setup;