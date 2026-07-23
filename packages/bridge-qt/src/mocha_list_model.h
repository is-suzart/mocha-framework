#pragma once

#include <QAbstractListModel>
#include <QJsonArray>
#include <QJsonValue>
#include <QJsonObject>
#include <QVariant>
#include <QByteArray>
#include <QHash>

class MochaListModel : public QAbstractListModel {
    Q_OBJECT

public:
    explicit MochaListModel(QObject* parent = nullptr);

    int rowCount(const QModelIndex& parent = QModelIndex()) const override;
    QVariant data(const QModelIndex& index, int role = Qt::DisplayRole) const override;
    QHash<int, QByteArray> roleNames() const override;

    void setRows(const QJsonArray& rows);
    int appendRow(const QJsonValue& row);
    void updateRow(int index, const QJsonValue& row);
    void removeRow(int index);
    void clear();

    Q_INVOKABLE QVariant get(int index) const;
    Q_INVOKABLE int count() const;

private:
    void detectRoles(const QJsonArray& rows);
    QJsonArray _rows;
    QHash<int, QByteArray> _roles;
};
