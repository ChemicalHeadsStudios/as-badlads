
/**
 * A BadLads Object id (64 bit unsigned integer). Consists of a pointer like id that the host uses for object lookups. 
 * The first 32 starting bits are reserved for the object search flags (8 bits from the beginning), the next 32 bits represent the actual object id.
 * Internally BadLads uses Object Hash Buckets to lookup an object, this means object lookups are quite fast.
 */
export declare type BadLadsObject = u64;
export declare function __hostPostPlayerChatMessage(playerState: BadLadsObject, string_ptr: ArrayBuffer, num_char: i32, color: i32, isServerMessage: bool): void
export declare function __hostGlobalPostChatMessage(string_ptr: ArrayBuffer, num_char: i32, color: i32, isServerMessage: bool): void
export declare function __hostGetObjectIdsOwnedUInt64s(objectTypeFlags: u32) : ArrayBuffer;
export declare function __hostGetBadLadsVersionOwnedString() : ArrayBuffer;
export declare function __hostSetObjectTransform(objectId: BadLadsObject, x: f32, y: f32, z: f32, 
    pitch: f32, yaw: f32, roll: f32, scaleX: f32, scaleY: f32, scaleZ: f32) : bool;
export declare function __hostGetObjectTranformOwnedF32s(objectId: BadLadsObject) : ArrayBuffer;
export declare function __hostSetObjectHealth(objectId: BadLadsObject, NewHealth: i32): bool;
export declare function __hostGetObjectClassNameOwnedString(objectTypeFlag: u32): ArrayBuffer;
export declare function __hostSpawnObject(objectTypeFlag: u32, objectId: u32, asyncSpawn: bool,  x: f32, y: f32, z: f32, 
    pitch: f32, yaw: f32, roll: f32, scaleX: f32, scaleY: f32, scaleZ: f32): BadLadsObject;
export declare function __hostGetPlayerNameOwnedString(playerState: BadLadsObject): ArrayBuffer;
export declare function __hostGetPlayerAccountId(playerState: BadLadsObject): u64;
export declare function __hostKickPlayerAccountId(playerAccountId: u64) : bool;
export declare function __hostBanPlayerAccountId(playerAccountId: u64) : BadLadsBanReply;
export declare function __hostUnbanPlayerAccountId(playerAccountId: u64) : bool;
export declare function __hostIsPlayerAccountIdBanned(playerAccountId: u64): bool;
export declare function __hostSetDoorState(estateObject: BadLadsObject, stateAndSide: i32): bool;
export declare function __hostGetEstateBuildableObjectsUInt64s(estateVolume: BadLadsObject): ArrayBuffer;
export declare function __hostGivePlayerStateItem(playerStateObject: BadLadsObject, itemId: i32, stackSize: i32, autoStack: bool): bool;
export declare function __hostGetObjectBoundsOwnedF32s(object: BadLadsObject): ArrayBuffer;
export declare function __hostSetPlayerJob(playerState: BadLadsObject, jobName: ArrayBuffer, jobNameLength: u32, bBroadcastBecome: bool, 
    bCheckForAvailability: bool, bTryRespawn: bool, bWasDemoted: bool, bForceRespawn: bool): bool;
export declare function __hostGetPlayerJobOwnedString(playerState: BadLadsObject): ArrayBuffer;
export declare function __hostIsObjectValid(object: BadLadsObject): bool;
export declare function __hostGetPlayerStateCharacter(playerState: BadLadsObject): BadLadsObject;

/**
 * Generic 3 dimensional vector class, no vector math has been implemented.
 * Up is +z
 */
export class Vector {
    x: f32;
    y: f32;
    z: f32;

    constructor(x: f32, y: f32, z: f32) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    toString(): string {
        return `(x: ${this.x}, y: ${this.y}, z: ${this.z})`
    }

    static ONE: Vector = new Vector(1, 1, 1);
    static ZERO: Vector = new Vector(0, 0, 0);
}


/**
 * Generic rotation class, roll, yaw pitch. Doesn't handle gimbal lock.
 */
export class Rotation {
    pitch: f32;
    yaw: f32;
    roll: f32;

    constructor(pitch: f32, yaw: f32, roll: f32) {
        this.pitch = pitch;
        this.yaw = yaw;
        this.roll = roll;
    }

    toString(): string {
        return `(pitch: ${this.pitch}, yaw: ${this.yaw}, roll: ${this.roll})`
    }

    static ZERO: Rotation = new Rotation(0, 0, 0);
}

/**
 * A generic Trasnform most commonly used for objects in BadLads. Consists of a position vector, rotation vector and a scale vector.
 */
export class Transform {
    position: Vector;
    rotation: Rotation;
    scale: Vector

    constructor(position: Vector, rotation: Rotation, scale: Vector) {
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
    }

    toString(): string {
        return `(position: ${this.position}, rotation: ${this.rotation}, scale: ${this.scale})`
    }

    static IDENTITY: Transform = new Transform(Vector.ZERO, Rotation.ZERO, Vector.ONE);
}

export enum BadLadsBanReply {
    Banned,
	AlreadyBanned,
	InvalidPlayerId,
}

/**
 * BadLadsObjectFlags, most commonly used to search for a particular object type.
 * ```typescript
 * // Single object flag.
 * const onlyVehiclesFlags = BadLadsObjectFlags.Vehicles;
* // Multiple object flag.
 * const vehiclesAndBuildablesFlags = BadLadsObjectFlags.Vehicles | BadLadsObjectFlags.Buildables;
 * ```
 */
export enum BadLadsObjectFlags {
    None                = 0,
	PlayerStates        = 1 << 1,
	PlayerCharacters    = 1 << 2,
	Vehicles            = 1 << 3,
	EstateVolumes       = 1 << 4,
	EstateObjects	    = 1 << 5,
	Buildables          = 1 << 6,
	All                 = u8.MAX_VALUE
}

/**
 * A generic color class, internally represented as 3 unsigned 8 bit integers. (0-255, 0-255, 0-255)
 */
export class Color {
    r: u8;
    g: u8;
    b: u8

    constructor(R: u8, G: u8, B: u8) {
        this.r = R;
        this.g = G;
        this.b = B;
    }

    // @ts-ignore
    @inline
    toPackedBGR(): i32 {
        return i32(this.b) << 24 | i32(this.g) << 16 | i32(this.r << 8);
    }

    toString(): string {
        return `(r: ${this.r}, g: ${this.g}, b: ${this.b})`
    }

    static WHITE: Color = new Color(255, 255, 255);
    static BLACK: Color = new Color(0, 0, 0);
    static RED: Color = new Color(255, 0, 0);
    static GREEN: Color = new Color(0, 255, 0);
    static BLUE: Color = new Color(0, 0, 255);
};

/**
 * Returns a PlayerCharacter object from a given PlayerState object.
 * @param playerState 
 * @returns 
 */
// @ts-ignore
@inline
export function getPlayerCharacter(playerState: BadLadsObject): BadLadsObject {
    return __hostGetPlayerStateCharacter(playerState);
}

/**
 * Check if the given object is valid. Works on all object types.
 * e.g. you can use this to check whether a player is still alive by checking their PlayerCharacter validity. 
 * @param object 
 * @returns 
 */
// @ts-ignore
@inline
export function isObjectValid(object: BadLadsObject): bool {
    if(object != 0) {
        return __hostIsObjectValid(object);
    }
    return false;
}

/**
 * Post a global chat message.
 * @param messageString 
 * @param color 
 * @param isEventful Eventful messages appear on the players notification bar.
 */
// @ts-ignore
@inline
export function postGlobalChatMessage(messageString: string, color: Color = Color.WHITE, isEventful: bool = false): void {
    const messageBuffer = String.UTF8.encode(messageString, true);
    __hostGlobalPostChatMessage(messageBuffer, messageBuffer.byteLength, color.toPackedBGR(), isEventful);
}

// @ts-ignore
@inline
export function postPlayerMessage(playerState: BadLadsObject, messageString: string, color: Color = Color.WHITE, isEventful: bool = false): void {
    const messageBuffer = String.UTF8.encode(messageString, true);
    __hostPostPlayerChatMessage(playerState, messageBuffer, messageBuffer.byteLength, color.toPackedBGR(), isEventful);
}

/**
 * Decode a linear memory UTF8 ArrayBuffer into a string. 
 * @param message 
 * @returns 
 */
// @ts-ignore
@inline
export function decodeString(message: ArrayBuffer): string {
    return String.UTF8.decode(message, true);
}

/**
 * @returns The host's game version.
 */
// @ts-ignore
@inline
export function getBadLadsVersion(): String {
    return String.UTF8.decode(__hostGetBadLadsVersionOwnedString());
}

/**
 * Returns all object with the matching Object flags.
 * @param flags 
 * @returns 
 */
// @ts-ignore
@inline
export function getObjectsIdsByType(flags: BadLadsObjectFlags): Uint64Array {
    return Uint64Array.wrap(__hostGetObjectIdsOwnedUInt64s(flags));
}

/**
 * Set the objects server transform.
 * @param object A transformable object.
 * @param transform 
 * @returns 
 */
// @ts-ignore
@inline
export function setObjectTransform(object: BadLadsObject, transform: Transform): bool {
    return __hostSetObjectTransform(object, transform.position.x, transform.position.y, transform.position.z, 
        transform.rotation.pitch, transform.rotation.yaw, transform.rotation.roll, 
            transform.scale.x, transform.scale.y, transform.scale.z);
}

/**
 * Get the objects transform.
 * @param objectId 
 * @returns 
 */
// @ts-ignore
@inline
export function getObjectTransform(objectId: BadLadsObject): Transform | null {
    const transformBuffer: Float32Array = Float32Array.wrap(__hostGetObjectTranformOwnedF32s(objectId));
    if(transformBuffer != null) {
        return new Transform(
            new Vector(transformBuffer[0], transformBuffer[1], transformBuffer[2]), 
            new Rotation(transformBuffer[3],transformBuffer[4],transformBuffer[5]), 
            new Vector(transformBuffer[6],transformBuffer[7],transformBuffer[8]));
    }
    return null;
}

/**
 * Returns the name of the object flags class. Object flags can be extracted from BadLadsObject id's.
 * @param objectFlag Must be a single flag.
 * @returns 
 */
export function getObjectFlagClassName(objectFlag: BadLadsObjectFlags) : string {
    return decodeString(__hostGetObjectClassNameOwnedString(objectFlag));
}

/**
 * 
 * @param objectFlag What type of object do want to spawn in? Must be a single flag.
 * @param objectIndex The object's index, different for each object category.
 * @param transform 
 * @param bAsync If enabled the object will spawn async and not return a object id.
 * @returns 
 */
// @ts-ignore
@inline
export function spawnObject(objectFlag: BadLadsObjectFlags, objectIndex: i32, transform: Transform, bAsync: bool = false): BadLadsObject {
    return __hostSpawnObject(objectFlag, objectIndex,  bAsync,
        transform.position.x, transform.position.y, transform.position.z, 
        transform.rotation.pitch, transform.rotation.yaw, transform.rotation.roll, 
            transform.scale.x, transform.scale.y, transform.scale.z);
}

/**
 * 
 * @param playerState 
 * @returns The unique id of the playerstate, under a Steam server this would a 64 bit SteamId. 
 * Returns 0 if playerstate was not found.
 */
// @ts-ignore
@inline
export function getPlayerAccountId(playerState: BadLadsObject): u64 {
    return __hostGetPlayerAccountId(playerState);
}

export function getPlayerName(playerState: BadLadsObject): string {
    return decodeString(__hostGetPlayerNameOwnedString(playerState));
}

// @ts-ignore
@inline
export function kickPlayer(playerState: BadLadsObject): bool {
    const playerAccountId = getPlayerAccountId(playerState);
    if(playerAccountId != 0) {
        return __hostKickPlayerAccountId(playerAccountId);
    }
    return false;
}

// @ts-ignore
@inline
export function banPlayer(playerState: BadLadsObject): BadLadsBanReply {
    const playerAccountId = getPlayerAccountId(playerState);
    if(playerAccountId != 0) {
        return __hostBanPlayerAccountId(playerAccountId);
    }
    return BadLadsBanReply.InvalidPlayerId;
}

/**
 * 
 * @param playerState 
 * @param newHealth The new health, if this is set to 0 the object will die. 
 * @returns Whether we have successfully set the living objects health.
 */
// @ts-ignore
@inline
export function setLivingHealth(playerState: BadLadsObject, newHealth: i32): bool {
    return __hostSetObjectHealth(playerState, newHealth)
}

/**
 * 
 * @param doorObject The EstateObject that is a door.
 * @param state 0 is closed, 1 is open forwards and -1 is open backwards.
 * @returns 
 */
// @ts-ignore
@inline
export function setDoorState(doorObject: BadLadsObject, state: i32): bool {
    return __hostSetDoorState(doorObject, state);
}

/**
 * Returns all the owned buildables by the estate volume.
 * @param estateVolume 
 * @returns 
 */
// @ts-ignore
@inline
export function getEstateVolumeBuildables(estateVolume: BadLadsObject): Uint64Array {
    return Uint64Array.wrap(__hostGetEstateBuildableObjectsUInt64s(estateVolume));
}

/**
 * Give a 
 * @param playerState 
 * @param itemId 
 * @param stackSize 
 * @param autoStack 
 * @returns whether the player received said item, could be false in cases of a full inventory. 
 */
// @ts-ignore
@inline
export function giveItem(playerState: BadLadsObject, itemId: i32, stackSize: i32 = 1, autoStack: bool = true) : bool {
    return __hostGivePlayerStateItem(playerState, itemId, stackSize, autoStack);
}

/**
 * @param object 
 * @returns a static array of 2 vectors. 1st one being the center of the bounds, second one being the extents.
 */
export function getObjectBounds(object: BadLadsObject): StaticArray<Vector> {
    var array = new StaticArray<Vector>(2);
    var centerAndBounds = Float32Array.wrap(__hostGetObjectBoundsOwnedF32s(object));
    array[0] = new Vector(centerAndBounds[0], centerAndBounds[1], centerAndBounds[2]);
    array[1] = new Vector(centerAndBounds[3], centerAndBounds[4], centerAndBounds[5]);
    return array;
}

// @ts-ignore
@inline
export function getPlayerJob(playerState: BadLadsObject): string {
    return decodeString(__hostGetPlayerJobOwnedString(playerState));
}

// @ts-ignore
@inline
export function setPlayerJob(playerState: BadLadsObject, job: string, bBroadcastBecome: bool = true, 
    bCheckForAvailability: bool = false, bTryRespawn: bool = true, bWasDemoted: bool = false, bForceRespawn: bool = false): bool {
    const jobBuffer = String.UTF8.encode(job, true);

    return __hostSetPlayerJob(playerState, jobBuffer, jobBuffer.byteLength, bBroadcastBecome, bCheckForAvailability, bTryRespawn, bWasDemoted, bForceRespawn);
}