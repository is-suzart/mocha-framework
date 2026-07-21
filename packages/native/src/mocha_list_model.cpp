#include "mocha_list_model.h"

MochaListModel::MochaListModel(QObject* parent)
    : QAbstractListModel(parent)
{
}

int MochaListModel::rowCount(const QModelIndex& parent) const {
    if (parent.isValid()) return 0;
    return _rows.size();
}

QVariant MochaListModel::data(const QModelIndex& index, int role) const {
    if (!index.isValid() || index.row() < 0 || index.row() >= _rows.size())
        return QVariant();

    QJsonValue val = _rows.at(index.row());

    if (val.isObject()) {
        QJsonObject obj = val.toObject();
        QByteArray roleName = _roles.value(role, "modelData");
        if (obj.contains(roleName)) {
            return obj.value(roleName).toVariant();
        }
        return QVariant();
    }

    if (role == Qt::DisplayRole)
        return val.toVariant();
    return QVariant();
}

QHash<int, QByteArray> MochaListModel::roleNames() const {
    return _roles;
}

void MochaListModel::detectRoles(const QJsonArray& rows) {
    _roles.clear();
    if (rows.isEmpty()) {
        _roles.insert(Qt::DisplayRole, "modelData");
        return;
    }

    QJsonValue first = rows.first();
    if (first.isObject()) {
        QJsonObject obj = first.toObject();
        int roleIdx = Qt::UserRole;
        for (auto it = obj.begin(); it != obj.end(); ++it) {
            _roles.insert(roleIdx, it.key().toUtf8());
            roleIdx++;
        }
    } else {
        _roles.insert(Qt::DisplayRole, "modelData");
    }
}

void MochaListModel::setRows(const QJsonArray& rows) {
    beginResetModel();
    _rows = rows;
    detectRoles(rows);
    endResetModel();
}

int MochaListModel::appendRow(const QJsonValue& row) {
    int idx = _rows.size();
    beginInsertRows(QModelIndex(), idx, idx);
    _rows.append(row);
    endInsertRows();
    return idx;
}

void MochaListModel::updateRow(int index, const QJsonValue& row) {
    if (index < 0 || index >= _rows.size()) return;
    _rows[index] = row;
    emit dataChanged(this->index(index), this->index(index));
}

void MochaListModel::removeRow(int index) {
    if (index < 0 || index >= _rows.size()) return;
    beginRemoveRows(QModelIndex(), index, index);
    _rows.removeAt(index);
    endRemoveRows();
}

void MochaListModel::clear() {
    beginResetModel();
    _rows = QJsonArray();
    endResetModel();
}

QVariant MochaListModel::get(int index) const {
    if (index < 0 || index >= _rows.size()) return QVariant();
    return _rows.at(index).toVariant();
}

int MochaListModel::count() const {
    return _rows.size();
}

#include "mocha_list_model.moc"
