import * as _ from 'lodash';

import { BACnetTypeBase } from '../type.base';

import * as Enums from '../../enums';

import * as Interfaces from '../../interfaces';

import * as Errors from '../../errors';

import * as IOs from '../../io';

export class BACnetBoolean extends BACnetTypeBase {
    public readonly className: string = 'BACnetBoolean';
    public readonly type: Enums.PropertyType = Enums.PropertyType.boolean;

    protected tag: Interfaces.Tag;
    protected data: boolean;

    constructor (defValue?: boolean) {
        super();

        this.data = _.isUndefined(defValue)
            ? false : this.checkAndGetValue(defValue);
    }

    /**
     * Creates the instance of the BACnetBoolean and calls the `readValue`
     * method.
     *
     * @param  {IOs.Reader} reader - BACnet reader (IO logic)
     * @param  {Interfaces.ReaderOptions} [opts] - reader options
     * @return {BACnetBoolean}
     */
    static readParam (reader: IOs.Reader, opts?: Interfaces.ReaderOptions): BACnetBoolean {
        return super.readParam(reader, opts);
    }

    /**
     * Parses the message with BACnet `boolean` value.
     *
     * @param  {IOs.Reader} reader - BACnet reader (IO logic)
     * @param  {Interfaces.ReaderOptions} [opts] - reader options
     * @return {void}
     */
    public readValue (reader: IOs.Reader, opts?: Interfaces.ReaderOptions): void {
        const tag = reader.readTag(opts);
        this.tag = tag;

        switch (tag.type) {
            case Enums.TagType.application:
                this.data = !!tag.value;
                break;
            case Enums.TagType.context:
                this.data = !!reader.readUInt8(opts)
        }
    }

    /**
     * Writes the BACnet `boolean` as BACnet value.
     *
     * @param  {IOs.Writer} writer - BACnet writer (IO logic)
     * @return {void}
     */
    public writeValue (writer: IOs.Writer): void {
        writer.writeTag(Enums.PropertyType.boolean, Enums.TagType.application, +this.data);
    }

    /**
     * Writes the BACnet `boolean` as BACnet property (param).
     *
     * @param  {IOs.Writer} writer - BACnet writer (IO logic)
     * @param  {Interfaces.Tag} tag - BACnet property tag
     * @return {void}
     */
    public writeParam (writer: IOs.Writer, tag: Interfaces.Tag): void {
        const dataSize: number = 1;
        // Tag Number - Tag Type - Param Length (bytes)
        writer.writeTag(tag.num, tag.type, dataSize);
        // Write "boolean" value
        writer.writeUIntValue(+this.data);
    }

    /**
     * Sets the new value of the BACnet type.
     *
     * @param  {boolean} newValue - new value
     * @return {void}
     */
    public setValue (newValue: boolean): void {
        this.data = this.checkAndGetValue(newValue);
    }

    /**
     * Returns the value of the BACnet type.
     *
     * @return {boolean}
     */
    public getValue (): boolean {
        return this.data;
    }

    /**
     * `boolean` value
     *
     * @type {number}
     */
    public set value (newValue: boolean) {
        this.setValue(newValue);
    }
    /**
     * @type {boolean}
     */
    public get value (): boolean {
        return this.getValue();
    }

    /**
     * Returns `true` if "value" is a correct "boolean" value, throws
     * the error if "value" has incorrect type.
     *
     * @param  {boolean} value - "boolean" value
     * @return {boolean}
     */
    private checkAndGetValue (value: boolean): boolean {
        if (!_.isBoolean(value)) {
            throw new Errors.BACnet('BACnetBoolean - updateValue: Value must be of type "boolean"!');
        }

        return value;
    }
}
