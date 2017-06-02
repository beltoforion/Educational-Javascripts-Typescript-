/// <reference path="./IIntegrator.ts"/>
/// <reference path="./IModel.ts"/>

class IntegratorRK5 implements IIntegrator {
    
    private h : number;

    private model : IModel;

    private time : number;

    private state : number [] = [];

    private tmp : number [] = [];

    private k1 : number [] = [];

    private k2 : number [] = [];

    private k3 : number [] = [];

    private k4 : number [] = [];

    private k5 : number [] = [];

    private k6 : number [] = [];

    public setStepSize(h : number) : void {
        this.h = h;
    }

    public getStepSize() : number
    {
            return this.h;
    }

    public setModel(model : IModel) : void {
        this.model = model;
    }

    public singleStep() : number [] {

        let dim = this.state.length;

        // k1
        this.model.eval(this.state, this.time, this.k1);

        // k2
        for (var i=0; i<dim; ++i)
            this.tmp[i] = this.state[i] + 0.25 * this.h * this.k1[i];

        this.model.eval(this.tmp, this.time + 0.25 * this.h, this.k2);

        // k3
        for (var i=0; i<dim; ++i)
            this.tmp[i] = this.state[i] + this.h * (3.0/32.0 * this.k1[i] + 9.0/32.0 * this.k2[i]);

        this.model.eval(this.tmp, this.time + 3.0/8.0 * this.h, this.k3);

        // k4
        for (var i=0; i<dim; ++i)
            this.tmp[i] = this.state[i] + this.h * (1932.0/2197.0*this.k1[i] - 7200.0/2197.0 * this.k2[i] + 7296.0/2197.0 * this.k3[i]);

        this.model.eval(this.tmp, this.time + 12.0/13.0 * this.h, this.k4);

        // k5
        for (var i=0; i<dim; ++i)
            this.tmp[i] = this.state[i] + this.h * (439.0/216.0*this.k1[i] - 8.0 * this.k2[i] + 3680.0/513.0*this.k3[i] - 845.0/4104.0*this.k4[i]);

        this.model.eval(this.tmp, this.time + this.h, this.k5);

        // K6
        for (var i=0; i<dim; ++i)
            this.tmp[i] = this.state[i] + this.h * ( -8.0/27.0*this.k1[i] + 2.0 * this.k2[i] - 3544.0/2565.0*this.k3[i] + 1859.0/4104.0*this.k4[i] - 11.0/40.0*this.k5[i]);

        this.model.eval(this.tmp, this.time + 0.5 * this.h, this.k6);

        // rk5
        for (var i=0; i<dim; ++i)
            this.state[i] += this.h * (     16.0 / 135.0   * this.k1[i] +
                                          6656.0 / 12825.0 * this.k3[i] +
                                         28561.0 / 56430.0 * this.k4[i] -
                                             9.0 / 50.0    * this.k5[i] +    
                                             2.0 / 55.0    * this.k6[i]);

        this.time += this.h;

        return this.state;
    }

    public setInitialState(state : number []) : void {
        for (var i=0; i<state.length; ++i) {
            this.state[i] = state[i];
            this.k1[i] = 0;
            this.k2[i] = 0;
            this.k3[i] = 0;
            this.k4[i] = 0;
            this.k5[i] = 0;
            this.k6[i] = 0;
        }

        this.time = 0;
    }

    constructor(model : IModel) {
        this.h = 3;
        this.time = 0;
        this.model = model;
    }
}