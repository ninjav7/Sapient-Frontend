import Enumerable from 'linq';

export const LeftJoin = (source, inner, pk, fk, result) =>
    Enumerable.from(source)
        .groupJoin(
            Enumerable.from(inner),
            s => pk(s),
            i => fk(i),
            (left, right) => ({ left, right })
        )
        .selectMany(
            m => m.right.defaultIfEmpty(),
            (prev, right) => result(prev.left, right))

Enumerable.prototype.leftJoin = function (inner, pk, fk, result) {
    return LeftJoin(this, inner, pk, fk, result);
}

export const RightJoin = (source, inner, pk, fk, result) =>
    Enumerable.from(inner)
        .groupJoin(
            Enumerable.from(source),
            i => fk(i),
            s => pk(s),
            (right, left) => ({ right, left })
        )
        .selectMany(
            m => m.left.defaultIfEmpty(),
            (prev, left) => result(left, prev.right)
        )

Enumerable.prototype.rightJoin = function (inner, pk, fk, result) {
    return RightJoin(this, inner, pk, fk, result);
}

export const UnionDistinct = (left, right) => {
    return Enumerable.from(left)
        .union(Enumerable.from(right))
        .distinct(s => JSON.stringify(s));
}

Enumerable.prototype.unionDistinct = function (right) {
    return UnionDistinct(this, right);
}

export const FullOuterJoin = (source, inner, pk, fk, result) => {
    var left = LeftJoin(source, inner, pk, fk, result);
    var right = RightJoin(source, inner, pk, fk, result);

    return left.unionDistinct(right);
}

Enumerable.prototype.fullOuterJoin = function (inner, pk, fk, result) {
    return FullOuterJoin(this, inner, pk, fk, result);
}
